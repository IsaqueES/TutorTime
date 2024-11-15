//Frameworks etc...
    const express = require('express')
    const app = express()
    const bodyParser = require('body-parser')
    const handlebars = require('express-handlebars')
//Banco de dados
    const tutortime = require('./models/dados')
    const { Sequelize } = require('sequelize')
    //Tabelas    
        const Monitorias = tutortime.Monitoria
        const Professor= tutortime.Professor
        const Monitor= tutortime.Monitor
        const Inscricao= tutortime.Inscricao
        const Materia = tutortime.Materia
        const Existente = tutortime.Existente
        let c = 1
    //Multer(upload de arquivos)
        const multer = require('multer')
        
        const path = require('path')

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
              cb(null, '/uploads');  // Define o diretório público para as imagens
            },
            filename: (req, file, cb) => {
              cb(null, Date.now() + path.extname(file.originalname));  // Define o nome do arquivo
            }
          });

          const upload = multer({ storage: storage })
//TESTE
    /*const todasDisciplinas = [
        // Original
        'Algoritmos e Lógica de Programação',
        'Programação Orientada a Objetos',
        'Estruturas de Dados',
        'Banco de Dados',
        'Sistemas Operacionais',
        'Redes de Computadores',
        'Engenharia de Software',
        'Desenvolvimento Web',
        'Inteligência Artificial',
        'Análise e Projeto de Sistemas',
        'Teoria da Computação',
        'Matemática Discreta',
        'Cálculo',
        'Física',
        'Química',
        'Educação Física',
        'Inglês',
        'Empreendedorismo',
        'Ética e Cidadania',
        'Arquitetura',
        'Design de Interiores',
        
        // Maiúsculas
        'ALGORITMOS E LÓGICA DE PROGRAMAÇÃO',
        'PROGRAMAÇÃO ORIENTADA A OBJETOS',
        'ESTRUTURAS DE DADOS',
        'BANCO DE DADOS',
        'SISTEMAS OPERACIONAIS',
        'REDES DE COMPUTADORES',
        'ENGENHARIA DE SOFTWARE',
        'DESENVOLVIMENTO WEB',
        'INTELIGÊNCIA ARTIFICIAL',
        'ANÁLISE E PROJETO DE SISTEMAS',
        'TEORIA DA COMPUTAÇÃO',
        'MATEMÁTICA DISCRETA',
        'CÁLCULO',
        'FÍSICA',
        'QUÍMICA',
        'EDUCAÇÃO FÍSICA',
        'INGLÊS',
        'EMPREENDEDORISMO',
        'ÉTICA E CIDADANIA',
        'ARQUITETURA',
        'DESIGN DE INTERIORES',
        
        // Minúsculas
        'algoritmos e lógica de programação',
        'programação orientada a objetos',
        'estruturas de dados',
        'banco de dados',
        'sistemas operacionais',
        'redes de computadores',
        'engenharia de software',
        'desenvolvimento web',
        'inteligência artificial',
        'análise e projeto de sistemas',
        'teoria da computação',
        'matemática discreta',
        'cálculo',
        'física',
        'química',
        'educação física',
        'inglês',
        'empreendedorismo',
        'ética e cidadania',
        'arquitetura',
        'design de interiores',
        
        // Capitalizadas
        'Algoritmos E Lógica De Programação',
        'Programação Orientada A Objetos',
        'Estruturas De Dados',
        'Banco De Dados',
        'Sistemas Operacionais',
        'Redes De Computadores',
        'Engenharia De Software',
        'Desenvolvimento Web',
        'Inteligência Artificial',
        'Análise E Projeto De Sistemas',
        'Teoria Da Computação',
        'Matemática Discreta',
        'Cálculo',
        'Física',
        'Química',
        'Educação Física',
        'Inglês',
        'Empreendedorismo',
        'Ética E Cidadania',
        'Arquitetura',
        'Design De Interiores',
        
        // Primeira palavra
        'Algoritmos',
        'Programação',
        'Estruturas',
        'Banco',
        'Sistemas',
        'Redes',
        'Engenharia',
        'Desenvolvimento',
        'Inteligência',
        'Análise',
        'Teoria',
        'Matemática',
        'Cálculo',
        'Física',
        'Química',
        'Educação',
        'Inglês',
        'Empreendedorismo',
        'Ética',
        'Arquitetura',
        'Design',
        'Administração'
    ];*/

//-Config⚙️
    //Template Engine
        app.engine('handlebars', handlebars.engine({
            defaultLayout: 'main',  // Layout padrão
            runtimeOptions: {
                allowedProtoProperties: true,
                allowProtoPropertiesByDefault: true
            },
            helpers: {
                // Helper ifCond para comparar valores
                ifCond: function(v1, v2, options) {
                    if (v1 === v2) {
                        return options.fn(this);  // Se a comparação for verdadeira, executa o bloco {{#ifCond}}
                    }
                    return options.inverse(this);  // Caso contrário, executa o bloco {{else}} (ou retorna vazio)
                }
            }
        }));

        app.set('view engine','handlebars')

        // Pastas Publicas'
        app.use(express.static('uploads'))
        app.use(express.static('css'))      

    //BodyParser
        app.use(bodyParser.urlencoded({extended:false}))
        app.use(bodyParser.json())

//Rotas
    //          HOME
        app.get("/home",function(req,res){
            let primeiro =""
            async function one() {

                 primeiro = await Existente.findOne({order:[['id','ASC']]})
            }
            one()
            Existente.findAll({order:[['id','ASC']],offset:1}).then(function(existente){
                if(primeiro===null){
                    primeiro = 
                        {
                            nome:"Sem Monitorias",
                            imagemUrl:'https://images.pexels.com/photos/949587/pexels-photo-949587.jpeg?auto=compress&cs=tinysrgb&w=600'
                        }
                   
                }
                console.error(primeiro.nome)
                res.render('src/home/index',{Existente:existente,primeiro:primeiro})
            })
        })
    
    //          ABOUT
        app.get("/about",function(req,res){
                res.render('src/about/about')
        })
        
    //          SENHA
        app.get("/manage",async function (req,res) {
            res.render('src/senha')
        })
    //          MANAGE
        app.get("/manage/:senha", function(req, res) {
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
                        }
                    ],
                    raw: false
                }).then(function(monitorias) {
                    console.error("SENHA>>"+req.params.senha)
                    if (req.params.senha=='True') {
                        res.render('src/manage/manage', { Monitorias: monitorias, Materia: materias });
                    }else{
                        alert("ERRADA")
                        res.render('src/home/index')
                    }
                }).catch(function(error) {
                    console.error('Erro ao buscar monitorias:', error);
                    res.status(500).send('Erro ao carregar monitorias');
                });
            })
        });

    

    //          HOME >>> MATERIA
        app.get("/home/:materia", function(req, res) {
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
    //Adicionando Matérias
        app.get("/adicionar",async function (req,res)  {
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
          
              console.log("MATERIA CRIADA!", req.body.imagemREQ)
              res.redirect("/manage/True")
            }catch(erro){
                console.error("ERRO>"+erro)
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
                

                console.log(`ID MONITOR >>> ${id_moni}`);
                console.log(`ID PROFESSOR >>> ${id_prof}`);

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
                    console.error("IMAGEM>."+imagem.imagemUrl)
                    // Adicionar a nova matéria
                    await Existente.create({
                        nome: id_materia.nome, 
                        imagemUrl: imagem.imagemUrl
                    });
                    
                    console.log("Matéria adicionada: " + id_materia.nome);
                    
                    } else {
                    console.log("TEM " + verify[0].nome); 
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
                
                
                res.redirect('/manage/True');
            } catch (erro) {
                res.send("Deu Erro Boy >>>>> " + erro);
            }
            });
    
        /*
        +-------------+--------------+------+-----+---------+----------------+
        | Field       | Type         | Null | Key | Default | Extra          |
        +-------------+--------------+------+-----+---------+----------------+
        | id          | int          | NO   | PRI | NULL    | auto_increment |
        | inscricoes  | int          | YES  |     | 0       |                |
        | horario     | time         | NO   |     | NULL    |                |
        | dia         | varchar(255) | NO   |     | NULL    |                |
        | local       | varchar(255) | NO   |     | NULL    |                |
        | imagemUrl   | varchar(255) | YES  |     | NULL    |                |
        | descricao   | text         | YES  |     | NULL    |                |
        | professorId | int          | YES  | MUL | NULL    |                |
        | monitorId   | int          | YES  | MUL | NULL    |                |
        | materiaId   | int          | YES  | MUL | NULL    |                |
        | createdAt   | datetime     | NO   |     | NULL    |                |
        | updatedAt   | datetime     | NO   |     | NULL    |                |
        +-------------+--------------+------+-----+---------+----------------+
        */

    //Deletando Monitorias
        app.get('/deletar/:id',function(req,res){
            
            async function verificar() {
                const monitoriadele = await Monitorias.findOne({ where: { id: req.params.id } })
                if(monitoriadele!=null){
                    const id_mat_monitoria = monitoriadele.materiaId
                    const materia = await Materia.findOne({where:{id:id_mat_monitoria}})
                    const id_materia = materia.id
                    console.error(`${id_mat_monitoria} E ${id_materia}`)
                    const monitorias = await Monitorias.findAll({where:{materiaId:id_materia}})
                    if (monitorias.length===1) {
                        console.error("NAO TEM MAIS")
                        Existente.destroy({where:{nome:materia.nome}})
                    }
                    console.error("TEM ISSO DE MONITORIAS>>> "+monitorias.length)
                }
                
            }
          
            Monitorias.destroy({where:{'id':req.params.id}})
            verificar()
            res.redirect('/manage/True')
        })
    //Deletando Matérias
        app.get('/deletar/:id',async function(req,res){
            
        })

//Inicializando Servidor!
    app.listen(3000)
    console.log("Server Rodando na porta 3000!")