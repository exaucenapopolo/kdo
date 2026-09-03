import { Router } from "express";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const router = Router();

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  createdAt: string;
}

const DB_PATH = join(process.cwd(), "users.json");
const sessions = new Map<string, string>();

function loadUsers(): User[] {
  try {
    if (existsSync(DB_PATH)) return JSON.parse(readFileSync(DB_PATH, "utf8"));
  } catch {}
  return [];
}

function saveUsers(users: User[]): void {
  try {
    writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
  } catch {}
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "kdo_salt_2024").digest("hex");
}

function getAuthUser(req: any): User | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const userId = sessions.get(token);
  if (!userId) return null;
  return loadUsers().find(u => u.id === userId) ?? null;
}

router.post("/auth/register", (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nom, email et mot de passe requis" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Le mot de passe doit faire au moins 6 caractères" });
  }
  const users = loadUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: "Un compte existe déjà avec cet email" });
  }
  const user: User = {
    id: randomUUID(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone?.trim(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  const token = randomUUID();
  sessions.set(token, user.id);
  const { passwordHash: _, ...safeUser } = user;
  return res.status(201).json({ token, user: safeUser });
});

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: "Email ou mot de passe incorrect" });
  }
  const token = randomUUID();
  sessions.set(token, user.id);
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ token, user: safeUser });
});

router.get("/auth/me", (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: "Non authentifié" });
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ user: safeUser });
});

router.post("/auth/logout", (req, res) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    sessions.delete(auth.slice(7));
  }
  return res.json({ success: true });
});

router.put("/auth/profile", (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: "Non authentifié" });
  const { name, phone } = req.body;
  const users = loadUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx === -1) return res.status(404).json({ error: "Utilisateur introuvable" });
  if (name) users[idx].name = name.trim();
  if (phone !== undefined) users[idx].phone = phone?.trim();
  saveUsers(users);
  const { passwordHash: _, ...safeUser } = users[idx];
  return res.json({ user: safeUser });
});

export default router;
