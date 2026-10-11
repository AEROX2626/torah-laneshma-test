const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const email = process.argv[2] || 'admin@torah-laneshma.co.il';
const password = process.argv[3] || 'admin123456';

const storePath = path.join(__dirname, '..', 'app', 'data', 'admin_store.json');

function hashPassword(pass) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(pass, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

function seed() {
  console.log(`Seeding initial admin user: ${email}`);
  let store = { users: [], invites: [], submissions: [], faqs: [], site_docs: {}, settings: {} };
  
  if (fs.existsSync(storePath)) {
    try {
      store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
    } catch {}
  }

  const existingIdx = store.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  const passwordHash = hashPassword(password);
  
  const user = {
    id: existingIdx >= 0 ? store.users[existingIdx].id : 'user-admin-main',
    email: email.toLowerCase(),
    password_hash: passwordHash,
    role: 'admin',
    created_at: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    store.users[existingIdx] = user;
    console.log('Admin password updated successfully.');
  } else {
    store.users.push(user);
    console.log('Admin user created successfully.');
  }

  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
  console.log(`Initial admin credentials:`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

seed();
