const SUPABASE_URL = "https://rsmbcpenltekhivxzfox.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZVT2D5qWYxLLrODuyWs_cw_n4qLArrB";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const btnAnimaisCadastro = document.getElementById ("btn_animal_cadastro")
const var_nome = document.getElementById ("id_nome")
const var_idade = document.getElementById ("id_idade")
const var_raca = document.getElementById ("id_raca")
const var_sexo = document.getElementById ("id_sexo")

btnAnimaisCadastro.addEventListener("click", clicarCadastro);


async function clicarCadastro (event){
    // impede de apagar os dados do formulário
    event.preventDefault();

    // Verificar quem está logado
    const {data: usuarioData,error: }= await supabaseClient.auth.getUser()
    if (errorData || !usuarioData.user) {
        alert("Você não está logado");
        return;
    }

    const usuario = usuarioData.user
    
    // Capturar os dados digitados
    const animal = {
        nome: var_nome.value, 
        idade: var_idade.value,
        raca: var_raca.value,
        sexo: var_sexo.value,
        id_dono: usuario.id
    }

    // Validação dos campos
    if (!animal.nome || !animal.idade || !animal.raca || !animal.sexo) {
        alert("Preencha todos os campos");
        return;
    }

    try {
        // inserir dados no banco
        const {data, error} = await supabaseClient
        .from("animais")
        .insert([animal])
        .select()

        alert("Animal cadastrado com sucesso!")
        
        var_nome.value = ""
        var_idade.value = ""
        var_raca.value = ""
        var_sexo.value = ""

        await aparecerAnimais();

    } catch (error) {
        console.error("erro ao cadastrar animal",error)
        return
    }
}

const mostrarAnimais = document.getElementById ("mostrar_animais")
async function aparecerAnimais () {
    const {data: usuarioData, error: errorData } = await supabaseClient.auth.getUser()

   if (errorData || !usuarioData.user) {
    alert("Você não está logado");
    return;
}
    
    const {data,error} = await supabaseClient
    .from("animais")
    .select("*")
    .eq ("id_dono",usuarioData.user.id)


    if (error){
        console.error ("erro ao buscar animais",error);
        return
    }

    // limpa a área antes de mostrar os animais 
    mostrarAnimais.innerHTML= ""

    // mostrar dados do banco
    data.forEach((animal)=>{
        const card = document.createElement ("div")
        // adicionando uma classe na div
        card.classList.add("card_mostrar_animal")

        card.innerHTML = `
            <h3>🐾 ${animal.nome}</h3>
            <p>Idade: ${animal.idade}</p>
            <p>Raça: ${animal.raca}</p>
            <p>Sexo: ${animal.sexo}</p>
            <button class="btn_excluir">Excluir</button>
        `;
        
    const butao = card.querySelector(".btn_excluir");

    butao.addEventListener("click", () => {
        butaoExcluir(animal.id)
    })

    mostrarAnimais.appendChild(card)
    })
}

aparecerAnimais()

async function butaoExcluir(id){
    const confirmar = confirm ("Deseja excluir este animal?")

    if(!confirmar){
        return;
    }

    const { data,error }= await supabaseClient
    .from("animais")
    .delete()
    .eq("id",id)
    
    if (error){
        console.error("Erro ao excluir animal",error)
        alert("Erro ao excluir animal")
        return
    }

   alert("Sucesso ao excluir animal!")

   await aparecerAnimais()
}