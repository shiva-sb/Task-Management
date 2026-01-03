const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../supabase');

class User {
  static async create({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    // check duplicate
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle();

    if (existingUser) {
      throw new Error('User already exists');
    }

    // insert
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert([{ username, email, password: hashedPassword }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { user, token };
  }

  static async findByEmail(email) {
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    return user;
  }

  static async findById(id) {
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, username, email, created_at')
      .eq('id', id)
      .single();

    return user;
  }

  static async verifyCredentials(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return { isValid: false, user: null };

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return { isValid: false, user: null };

    delete user.password;
    return { isValid: true, user };
  }

  static async generateToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}

module.exports = User;
