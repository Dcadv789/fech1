import { supabase } from '../lib/supabase';
import { CategoryGroup, CreateCategoryGroupDTO, Category, CreateCategoryDTO } from '../types/category';

export const categoryService = {
  async getCategoryGroups(): Promise<CategoryGroup[]> {
    const { data, error } = await supabase
      .from('categorias_grupo')
      .select('*')
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async createCategoryGroup(group: CreateCategoryGroupDTO): Promise<CategoryGroup> {
    const { data, error } = await supabase
      .from('categorias_grupo')
      .insert(group)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async createCategory(category: CreateCategoryDTO): Promise<Category> {
    const { data, error } = await supabase
      .from('categorias')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};