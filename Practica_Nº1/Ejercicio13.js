//Antes
obtenerUsuario()
    .then(usuario => {
        obtenerPosts(usuario.id)
            .then(posts => console.log(posts));
    });
//Despues
async function obtenerDatos() {
    const usuario = await obtenerUsuario();
    const posts = await obtenerPosts(usuario.id);
    console.log(posts);
}