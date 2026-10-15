const SUPABASE_URL = "https://rsmbcpenltekhivxzfox.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZVT2D5qWYxLLrODuyWs_cw_n4qLArrB";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const butao_agendamento = document.getElementById("butao_agendamento")

const nomeDono = document.getElementById("nome_agendamento")
const nomeAnimal = document.getElementById("animal_agendamento")
const raca = document.getElementById("raca_agendamento")
const telefone = document.getElementById("telefone_agendamento")
const motivoConsulta = document.getElementById("motivo_agendamento")
const dataAgendamento  = document.getElementById("data_agendamento")
const horario = document.getElementById("horario_agendamento")

butao_agendamento.addEventListener("click", agendarConsulta);

async function agendarConsulta(event) {
    event.preventDefault()

    //quem ta logado
     const {data: usuarioData,error:errorData}= await supabaseClient.auth.getUser()
    if (errorData || !usuarioData.user) {
        alert("Você não está logado");
        return;
    }
    const usuario = usuarioData.user

    const agendamento = {
        dono: nomeDono.value, 
        animal:nomeAnimal.value,
        raca: raca.value,
        telefone: telefone.value,
        data: dataAgendamento.value,
        horario: horario.value,
        motivo:motivoConsulta.value,
        id_dono: usuario.id
    }
    
    //validação
    if(!agendamento.dono|| !agendamento.raca|| !agendamento.telefone|| !agendamento.data|| !agendamento.horario|| !agendamento.motivo){
        alert("sua consulta nao foi agendada")
        return
    }
    try {
        const {data,error} = await supabaseClient
        .from ("agendamentos")
        .insert ([agendamento])
        .select()
        
         if (error) {
            console.error("Erro ao agendar:", error);
            alert("Erro ao agendar consulta: " + error.message);
            return;
        }

        alert("sucesso ao agendar consulta!")

        nomeDono.value = ""
        nomeAnimal.value = ""
        raca.value=""
        telefone. value  = ""
        motivoConsulta.value = "" 
        dataAgendamento.value = ""
        horario.value = ""
        
        
    } catch (error) {
        console.error ("erro ao agendar",error)
        return 
    }
}
