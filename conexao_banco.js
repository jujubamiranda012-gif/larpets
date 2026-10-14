const SUPABASE_URL = "https://rsmbcpenltekhivxzfox.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZVT2D5qWYxLLrODuyWs_cw_n4qLArrB";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ELEMENTOS

const login = document.getElementById("login");

const usuarioLogado =
    document.getElementById("usuarioLogado");

const emailUsuario =
    document.getElementById("emailUsuario");

const email =
    document.getElementById("email");

const senha =
    document.getElementById("senha");

const mensagem =
    document.getElementById("mensagem");


// BOTÕES

document
    .getElementById("btnLogin")
    .addEventListener("click", entrar);

document
    .getElementById("btnCadastro")
    .addEventListener("click", cadastrar);

document
    .getElementById("btnLogout")
    .addEventListener("click", sair);


// ==========================
// VERIFICAR USUÁRIO LOGADO
// ==========================

async function verificarUsuario() {
    const {
        data: { session }
    } = await supabaseClient.auth.getSession();
    if (session) {
        mostrarUsuario(session.user);
    } else {
        mostrarLogin();
    }
}


// ==========================
// LOGIN
// ==========================

async function entrar() {
    const emailDigitado = email.value;
    const senhaDigitada = senha.value;
    if (!emailDigitado || !senhaDigitada) {
        mensagem.innerText =
            "Preencha e-mail e senha.";
        return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: emailDigitado,
            password: senhaDigitada
        });

    if (error) {
        console.error(error);
        mensagem.innerText =
            "E-mail ou senha incorretos.";
        return;
    }

    console.log("Usuário logado:", data.user);
    mostrarUsuario(data.user);
}


// ==========================
// CADASTRO
// ==========================

async function cadastrar() {
    const emailDigitado = email.value;
    const senhaDigitada = senha.value;

    if (!emailDigitado || !senhaDigitada) {
        mensagem.innerText =
            "Preencha e-mail e senha.";
        return;
    }


    if (senhaDigitada.length < 6) {
        mensagem.innerText =
            "A senha precisa ter pelo menos 6 caracteres.";
        return;
    }


    const { data, error } =
        await supabaseClient.auth.signUp({
            email: emailDigitado,
            password: senhaDigitada

        });


    if (error) {
        console.error(error);
        mensagem.innerText =
            error.message;
        return;
    }

    mensagem.innerText =
        "Conta criada com sucesso!";
    // Se a confirmação de e-mail estiver
    // desativada no Supabase, já entra automaticamente.

    if (data.session) {
        mostrarUsuario(data.user);
    } else {
        mensagem.innerText =
            "Conta criada! Verifique seu e-mail para confirmar.";
    }
}


// ==========================
// LOGOUT
// ==========================

async function sair() {
    const { error } =
        await supabaseClient.auth.signOut();
    if (error) {
        console.error(error);
        return;
    }

    mostrarLogin();
}


// ==========================
// MOSTRAR USUÁRIO
// ==========================

function mostrarUsuario(user) {
    login.style.display = "none";
    usuarioLogado.style.display = "block";
    emailUsuario.innerText =
        "Logado como: " + user.email;
}


// ==========================
// MOSTRAR LOGIN
// ==========================

function mostrarLogin() {
    login.style.display = "block";
    usuarioLogado.style.display = "none";
    email.value = "";
    senha.value = "";
    mensagem.innerText = "";
}


// ==========================
// INICIAR SISTEMA
// ==========================

verificarUsuario();