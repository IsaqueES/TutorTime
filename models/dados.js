//Database
    const { Sequelize, DataTypes } = require('sequelize');
    const sequelize = new Sequelize('tutortime','root','123456',{
        host:'localhost',
        dialect:'mysql',
        query:{raw:true},
        logging:false,
        port:process.env.DB_PORT || 3306,
    })
    let contador =0
//Chalk
    const chalk = require('chalk')
    const say =console.log

//Tabelas
    //Professores

        const Professor = sequelize.define('Professor', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        })
        if (Professor) {
            contador++
            say(chalk.yellow(`${contador}/5 `)+chalk.greenBright("Tabela ")+chalk.magenta("Professor ")+ chalk.greenBright("Criada com Sucesso!"))
        }else{
            say(chalk.redBright("Falha ao Criar Tabela Professor!"))
        }
        /*
        +-----------+--------------+------+-----+---------+----------------+
        | Field     | Type         | Null | Key | Default | Extra          |
        +-----------+--------------+------+-----+---------+----------------+
        | id        | int          | NO   | PRI | NULL    | auto_increment |
        | nome      | varchar(255) | NO   |     | NULL    |                |
        | email     | varchar(255) | YES  |     | NULL    |                |
        | createdAt | datetime     | NO   |     | NULL    |                |
        | updatedAt | datetime     | NO   |     | NULL    |                |
        +-----------+--------------+------+-----+---------+----------------+
        */

    //Monitores
        const Monitor = sequelize.define('Monitor', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            materia:{
                type:DataTypes.STRING,
                allowNull:false,
            }
        })
        if (Monitor) {
            contador++
            say(chalk.yellow(`${contador}/5 `)+chalk.greenBright("Tabela ")+chalk.magenta("Monitor ")+ chalk.greenBright("Criada com Sucesso!"))
        }else{
            say(chalk.redBright("Falha ao Criar Tabela Monitor!"))
        }

        /*
        +-----------+--------------+------+-----+---------+----------------+
        | Field     | Type         | Null | Key | Default | Extra          |
        +-----------+--------------+------+-----+---------+----------------+
        | id        | int          | NO   | PRI | NULL    | auto_increment |
        | nome      | varchar(255) | NO   |     | NULL    |                |
        | email     | varchar(255) | YES  |     | NULL    |                |
        | createdAt | datetime     | NO   |     | NULL    |                |
        | updatedAt | datetime     | NO   |     | NULL    |                |
        +-----------+--------------+------+-----+---------+----------------+
        */

    //Materias
        const Materia = sequelize.define('Materia', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            descricao: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            imagemUrl:{
                type:DataTypes.STRING,
                allowNull:true
            }
        })
        if (Materia) {
            contador++
            say(chalk.yellow(`${contador}/5 `)+chalk.greenBright("Tabela ")+chalk.magenta("Materia ")+ chalk.greenBright("Criada com Sucesso!"))
        }else{
            say(chalk.redBright("Falha ao Criar Tabela Materia!"))
        }
        /*
        +-----------+--------------+------+-----+---------+----------------+
        | Field     | Type         | Null | Key | Default | Extra          |
        +-----------+--------------+------+-----+---------+----------------+
        | id        | int          | NO   | PRI | NULL    | auto_increment |
        | nome      | varchar(255) | NO   |     | NULL    |                |
        | descricao | text         | YES  |     | NULL    |                |
        | createdAt | datetime     | NO   |     | NULL    |                |
        | updatedAt | datetime     | NO   |     | NULL    |                |
        +-----------+--------------+------+-----+---------+----------------+
        */

    //Monitoria
        const Monitoria = sequelize.define('Monitoria', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            inscricoes: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            horario: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            dia: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            local: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            imagemUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            descricao: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            professorId: {
                type: DataTypes.INTEGER,
                references: {
                    model: Professor,
                    key: 'id',
                },
            },
            monitorId: {
                type: DataTypes.INTEGER,
                references: {
                    model: Monitor,
                    key: 'id',
                },
            },
            materiaId: {
                type: DataTypes.INTEGER,
                references: {
                    model: Materia,
                    key: 'id',
                },
            }
        })
        if (Monitoria) {
            contador ++
            say(chalk.yellow(`${contador}/5 `)+chalk.greenBright("Tabela ")+chalk.magenta("Monitoria ")+ chalk.greenBright("Criada com Sucesso!"))
        }else{
            say(chalk.redBright("Falha ao Criar Tabela Monitoria!"))
        }
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

    //Monitorias Existentes
        const Existente = sequelize.define('Existente', {
            nome: {
              type: DataTypes.STRING,
              allowNull: false, // Garante que o campo nome não seja nulo
            },
            imagemUrl:{
                type:DataTypes.STRING
            },
            videoUrl:{
                type:DataTypes.STRING
            }
          })
        if (Existente) {
            contador++
            say(chalk.yellow(`${contador}/5 `)+chalk.greenBright("Tabela ")+chalk.magenta("Existente ")+ chalk.greenBright("Criada com Sucesso!"))
        }else{
            say(chalk.redBright("Falha ao Criar Tabela Existente!"))
        }
        /*
        +-----------+--------------+------+-----+---------+----------------+
        | Field     | Type         | Null | Key | Default | Extra          |
        +-----------+--------------+------+-----+---------+----------------+
        | id        | int          | NO   | PRI | NULL    | auto_increment |
        | nome      | varchar(255) | NO   |     | NULL    |                |
        | imagemUrl | varchar(255) | YES  |     | NULL    |                |
        | createdAt | datetime     | NO   |     | NULL    |                |
        | updatedAt | datetime     | NO   |     | NULL    |                |
        +-----------+--------------+------+-----+---------+----------------+
        */


    //Definindo os relacionamentos
        Monitoria.belongsTo(Professor, {
            foreignKey: 'professorId',
            as: 'Professor'
        });

        Monitoria.belongsTo(Monitor, {
            foreignKey: 'monitorId',
            as: 'Monitor'
        });

        Monitoria.belongsTo(Materia, {
            foreignKey: 'materiaId',
            as: 'Materia'
        });

        Professor.hasMany(Monitoria, {
            foreignKey: 'professorId',
            as: 'Monitorias'
        });

        Monitor.hasMany(Monitoria, {
            foreignKey: 'monitorId',
            as: 'Monitorias'
        });


        Materia.hasMany(Monitoria, {
            foreignKey: 'materiaId',
            as: 'Monitorias'
        });

        



    //Sincronizar todas as tabelas com o banco de dados
        sequelize.sync()
            .then(() => say(chalk.yellow("Todas as tabelas foram criadas com sucesso")))
            .catch((error) => console.error("Erro ao criar tabelas:", error));

//Exportação
    module.exports = { 
        Professor, 
        Monitor, 
        Materia, 
        Monitoria, 
        Existente
    };
