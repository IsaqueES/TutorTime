//Frameworks etc...
    const express = require('express')// Usado para gerenciar e manipular rotas
    const app = express()//  ^^^
    const bodyParser = require('body-parser')//Usado para requisitar dados do body
    const handlebars = require('express-handlebars')//Usado para definir templates e passar informações
    const chalk = require('chalk')
    const say =console.log
    const readline = require('readline');
    // Cria uma interface de leitura no terminal
    const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });

//Banco de dados
    const tutortime = require('./models/dados') 
    const { Sequelize } = require('sequelize')
    //Tabelas    
        const Monitorias = tutortime.Monitoria
        const Professor= tutortime.Professor
        const Monitor= tutortime.Monitor
        const Materia = tutortime.Materia
        const Existente = tutortime.Existente
        let c = 1

//-Config⚙️
    //Template Engine
        app.engine('handlebars', handlebars.engine({
            defaultLayout: 'main', 
            runtimeOptions: {
                allowedProtoProperties: true,
                allowProtoPropertiesByDefault: true
            },
            helpers: { 
                
                ifCond: function(v1, v2, options) {
                    if (v1 === v2) {
                        return options.fn(this);  
                    }
                    return options.inverse(this);  
                },
        
            
                equals: function(v1, v2, options) {
                    if (v1 == v2) {  
                        return options.fn(this);
                    }
                    return options.inverse(this)
                },
            }
        }))
        

        app.set('view engine','handlebars')//Definindo engine como HANDLEBARS

    //Pastas Publicas
        app.use(express.static('uploads'))
        app.use(express.static('css'))      

    //BodyParser
        app.use(bodyParser.urlencoded({extended:false}))
        app.use(bodyParser.json())

//Rotas
    
    //          HOME
        app.get("/home", async function(req, res) {
            say(chalk.bgCyan("Entrou em Home"));
            say(chalk.black("---------------"))
            let primeiro = await Existente.findOne({ order: [['id', 'ASC']] });
            
            if (!primeiro) {
                primeiro = {
                    nome: "Sem Monitorias",
                    imagemUrl: '/semonitoria.jpg',
                    videoUrl: "/semmonitoria.mp4"
                };
            }
        
            let existente = await Existente.findAll({ order: [['id', 'ASC']], offset: 1 });
            res.render('src/home/index', { Existente: existente, primeiro: primeiro });
        });
    
    //          ABOUT
        app.get("/about",function(req,res){
            say(chalk.bgCyan("Entrou em About"))
            say(chalk.black("---------------"))
            res.render('src/about/about')
        })
        
    //          SENHA
        app.get("/manage",async function (req,res) {
            say(chalk.bgCyan("Entrou em Senha"))
            say(chalk.black("---------------"))
            res.render('src/senha')
        })

    //          MANAGE
        app.get("/manage/:senha", function(req, res) {
            say(chalk.bgCyan("Entrou em Manage"))
            say(chalk.black("---------------"))
            Materia.findAll().then(function(materias) {
                Monitorias.findAll({
                    include: [
                        {
                            model: Materia,
                            as: 'Materia' // Certifique-se de usar o alias correto
                        },
                        {
                            model: Professor,
                            as: 'Professor'
                        },
                        {
                            model:Monitor,
                            as:'Monitor'
                        }
                    ],
                    raw: false

                }).then(function(monitorias) {

                    if (req.params.senha=='True') {

                        res.render('src/manage/manage', { Monitorias: monitorias, Materia: materias });
                    }else{

                        res.redirect("/home")
                    }

                }).catch(function(error) {

                    console.error('Erro ao buscar monitorias:', error);
                    res.status(500).send('Erro ao carregar monitorias');
                });
            })
        });

    

    //          HOME >>> MATERIA

        app.get("/home/:materia", function(req, res) {
            say(chalk.bgCyan("Entrou em Materia"))
            say(chalk.black("---------------"))
            async function desId() {

                const id_materia = await Materia.findOne({where:{nome:req.params.materia}})
                    if(id_materia!=null){

                        Monitorias.findAll({
                            where:{materiaId:id_materia.id},
                            include: [{
                                model: Monitor,
                                as:'Monitor'
                            },
                            {
                                model:Professor,
                                as:'Professor'
                            }
                        ],
                            raw:false
                            }).then(function (monitorias) {
                            res.render('src/new/new',{  
                                monitorias:monitorias,
                                REQ:req.params.materia,
                            })
                        })
                    }
            }

            desId()
        })

    //         TESTE
//Database
    //Adicionando Inscrições
        app.get("/inscrito/:id",async function (req,res) {
            
            const valorantigo = await Monitorias.findOne({where:{id:req.params.id}})
            const valor = valorantigo.inscricoes
            say(chalk.bgCyan("Se inscreveu em "+valorantigo.nome))
            say(chalk.black("---------------"))
            Monitorias.update({inscricoes:valor+1},{where:{id:req.params.id}})
            res.redirect("/home")
        })
    //Adicionando Matérias
        app.get("/adicionar",async function (req,res)  {
            say(chalk.bgCyan("Adicionando Materia"))
            say(chalk.black("---------------"))
            Materia.findAll().then(function (materia) {
                res.render("src/adicionar",{Materia:materia})
            })
        })

        app.post("/addmat", async function (req, res) {
            
            try {
              // Salva o caminho da imagem no banco de dados
              const novaMateria = await Materia.create({
                nome: req.body.materiaREQ,
                imagemUrl: req.body.imagemREQ // Salva o URL no banco de dados
              })
              say(chalk.bgCyan("Adicionou "+req.body.materiaREQ))
              say(chalk.black("---------------"))
              res.redirect("/manage/True")

            }catch(erro){
                console.error("ERRO EM ADICIONAR MATERIA :"+erro)
                res.send(erro)
            }
          });

    //Criando monitorias
        app.post("/add", async function(req, res) {
            
            try {
                const id_materia = await Materia.findOne({ where: { id: req.body.materiaREQ },
                    attributes: ['id', 'nome', 'imagemUrl'] })

                // Criação dos registros de Monitor e Professor
                const monitor = await Monitor.create({
                    nome: req.body.monitorREQ,
                    email: "TESTE",
                    materia:id_materia.nome
                })
                
                const professor = await Professor.create({
                    nome: req.body.professorREQ,
                    email: "TESTE"
                })
                
                const id_moni = monitor.id
                const id_prof = professor.id 

                async function verificarEAdicionarMateria(id_materia) {
                try {
                    
                    const verify = await Existente.findAll({
                    where: {
                        nome: id_materia.nome
                    }
                    });

                    
                    if (verify.length === 0) {
                    const imagem = await Materia.findOne({ where: { id: req.body.materiaREQ },
                        attributes: ['id', 'nome', 'imagemUrl'] })
                    // Adicionar a nova monitoria
                    await Existente.create({
                        nome: id_materia.nome, 
                        imagemUrl: imagem.imagemUrl
                    });
                    
                    
                    
                    }
                } catch (error) {
                    console.error('Erro ao verificar e adicionar matéria:', error);
                }
                }
                verificarEAdicionarMateria({ nome: id_materia.nome });


                await Monitorias.create({
                    horario: req.body.horarioREQ,
                    dia: req.body.diaREQ,
                    local: req.body.localREQ,
                    imagemUrl: id_materia.imagemUrl,
                    descricao: req.body.descricaoREQ,
                    professorId: id_prof,
                    monitorId: id_moni,
                    materiaId: id_materia.id
                });
                say(chalk.bgCyan("Adicionou Monitoria de "+id_materia.nome))
                say(chalk.black("---------------"))
                
                res.redirect('/manage/True');
            } catch (erro) {
                res.send("ERRO EM CRIAR MONITORIA" + erro);
            }
            });

    //Deletando Monitorias
    app.get('/deletar/:id', async function(req, res) {
        try {
            const monitoriadele = await Monitorias.findOne({ where: { id: req.params.id } });
            if (!monitoriadele) {
                return res.redirect('/manage/True');
            }
    
            await Monitorias.destroy({ where: { id: req.params.id } });
    
            say(chalk.bgCyan("Deletou Monitoria"));
            say(chalk.black("---------------"));
    
            const id_mat_monitoria = monitoriadele.materiaId;
            const materia = await Materia.findOne({ where: { id: id_mat_monitoria } });
    
            if (materia) {
                const monitorias = await Monitorias.findAll({ where: { materiaId: id_mat_monitoria } });
    
                if (monitorias.length === 0) {
                    await Existente.destroy({ where: { nome: materia.nome } });
                    say(chalk.bgCyan(`Deletou matéria ${materia.nome} `));
                }
            }
    
            res.redirect('/manage/True');
        } catch (error) {
            console.error("Erro ao excluir monitoria:", error);
            res.status(500).send('Erro ao excluir monitoria');
        }
    });
    
    //Deletando Matérias
        app.get('/deletarmat/:id', async function(req, res) {
            try {
                const materiaId = req.params.id
            
                await Monitorias.destroy({
                    where: { materiaId: materiaId }
                })
            
                const nomemat = await Materia.findOne({
                    where: { id: materiaId }
                })
            
                await Materia.destroy({
                    where: { id: materiaId }
                })
            
                await Existente.destroy({
                    where: { nome: nomemat.nome }
                })
                say(chalk.bgCyan("Deletou Materia : "+nomemat.nome))
                await say(chalk.black("---------------"))
                res.redirect('/adicionar')
                } catch (error) {
                console.error('Erro ao excluir matéria:', error)
                res.status(500).send('Erro ao excluir matéria.')
            }
        })
    
    //          404
    app.use((req,res,next)=>{
        res.render('src/erro')
    })
      
//Inicializando
function inicializar(){
    const port = process.env.PORT || 3000;
    app.listen(port, () => {

        say('')
        say(chalk.cyan(`  -Server is running on port `)+chalk.magenta(port));
        say(chalk.cyan(`  -http://localhost:${port}/home`))
        say('')
        say(chalk.gray(`Options : \nP - Parar servidor\nH - Help\nL - Link
            `))
        rl.on('line', (comando) => {
            comando = comando.trim().toUpperCase()
            if (comando === 'H') {
                say(chalk.magenta("TRABALHANDO NISSO"))
               }
            if (comando === 'P') {
                say(chalk.magenta("CLIQUE Ctrl+C"))
            }
            if (comando === 'L') {
                say(chalk.cyan(`Link : http://localhost:${port}/home`))
            }
        })
})}

inicializar()