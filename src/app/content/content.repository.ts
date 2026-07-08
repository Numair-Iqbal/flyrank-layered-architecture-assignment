import { supabase } from "@/lib/supabase";

export const ContentRepository = {
  async getPostById(id: string) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async incrementViewCount(id: string, newCount: number) {
    const { data, error } = await supabase
      .from("posts")
      .update({ view_count: newCount })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};


