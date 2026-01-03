const { supabase, supabaseAdmin } = require('../supabase');

class Task {
  static async create({ title, status = 'Todo', userId }) {
    try {
      const { data: task, error } = await supabaseAdmin
        .from('tasks')
        .insert([
          {
            title,
            status,
            user_id: userId
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      return task;
    } catch (error) {
      throw error;
    }
  }
  
  static async findAllByUser(userId) {
    try {
      const { data: tasks, error } = await supabaseAdmin
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return tasks;
    } catch (error) {
      throw error;
    }
  }
  
  static async findById(id, userId) {
    try {
      const { data: task, error } = await supabaseAdmin
        .from('tasks')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      return task;
    } catch (error) {
      throw error;
    }
  }
  
  static async update(id, userId, updates) {
    try {
      const { data: task, error } = await supabaseAdmin
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      return task;
    } catch (error) {
      throw error;
    }
  }
  
  static async delete(id, userId) {
    try {
      const { error } = await supabaseAdmin
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
  
  static async getStats(userId) {
    try {
      const { data: tasks, error } = await supabaseAdmin
        .from('tasks')
        .select('status')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      const stats = {
        total: tasks.length,
        todo: tasks.filter(task => task.status === 'Todo').length,
        inProgress: tasks.filter(task => task.status === 'In Progress').length,
        completed: tasks.filter(task => task.status === 'Completed').length
      };
      
      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Task;