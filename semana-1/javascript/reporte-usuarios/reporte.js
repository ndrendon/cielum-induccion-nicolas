export function contarPostsPorUsuario(posts) {
  return posts.reduce((conteo, post) => {
    conteo[post.userId] = (conteo[post.userId] ?? 0) + 1;
    return conteo;
  }, {});
}

export function generarReporte(usuarios, posts) {
  const postsPorUsuario = contarPostsPorUsuario(posts);

  return usuarios.map((usuario) => ({
    usuario: usuario.name,
    ciudad: usuario.address.city,
    cantidadPosts: postsPorUsuario[usuario.id] ?? 0,
  }));
}
