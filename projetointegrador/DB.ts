import { supabase } from './supabaseClient';

export const DbApi = {
  async upsertUser(user: {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    avatar?: string;
    endereco?: {
      rua?: string; bairro?: string; cidade?: string; estado?: string; cep?: string;
    };
    membroDesde?: string;
  }): Promise<void> {
    const payload = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone ?? null,
      avatar: user.avatar ?? null,
      endereco_rua: user.endereco?.rua ?? null,
      endereco_bairro: user.endereco?.bairro ?? null,
      endereco_cidade: user.endereco?.cidade ?? null,
      endereco_estado: user.endereco?.estado ?? null,
      endereco_cep: user.endereco?.cep ?? null,
      membroDesde: user.membroDesde ?? null,
    };
    const { error } = await supabase.from('users').upsert(payload);
    if (error) throw error;
  },

  async listCart(userId: string): Promise<Array<{ productId: string; quantidade: number }>> {
    const { data, error } = await supabase
      .from('cart')
      .select('productid, quantidade')
      .eq('userid', userId);
    if (error) throw error;
    return (data ?? []).map((row: any) => ({ productId: row.productid, quantidade: row.quantidade }));
  },

  async setCartItem(userId: string, productId: string, quantidade: number): Promise<void> {
    if (quantidade <= 0) {
      const { error } = await supabase.from('cart').delete().match({ userid: userId, productid: productId });
      if (error) throw error;
      return;
    }
    const { error } = await supabase.from('cart').upsert({
      id: `${userId}-${productId}`,
      userid: userId,
      productid: productId,
      quantidade,
    });
    if (error) throw error;
  },

  async toggleFavorite(userId: string, productId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('userid', userId)
      .eq('productid', productId)
      .limit(1);
    if (error) throw error;
    const exists = (data ?? []).length > 0;
    if (exists) {
      const { error: delErr } = await supabase.from('favorites').delete().match({ userid: userId, productid: productId });
      if (delErr) throw delErr;
      return false;
    } else {
      const { error: insErr } = await supabase.from('favorites').insert({
        id: `${userId}-${productId}`,
        userid: userId,
        productid: productId,
      });
      if (insErr) throw insErr;
      return true;
    }
  },
};

