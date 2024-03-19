require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING);
// const favoriteAnime = require('./animeDB.json');

// drop table if exists anime;
module.exports = {
    'seed': (req, res) => {
        sequelize.query(`
        
            create table anime(
                anime_id serial primary key,
                img varchar,
                anime_title varchar,
                rated varchar,
                ranking varchar
            )
        `).then(() => {
            console.log('Anime DB seeded!')
            res.status(200).end()
        }).catch(err => console.log('error seeding DB', err))
    },

    'getAllFavAnime': (req, res) => {
        sequelize.query('select * from anime')
        .then(dbRes => res.status(200).send(dbRes))
        .catch(err => console.log(err))
    },

    'addFavAnime': (req, res) => {
        const { img, title, rated, ranking } = req.body
        sequelize.query(`
            insert into anime(img, anime_title, rated, ranking)
            values ('${img}', '${title}', '${rated}', '${ranking}')
        `)
        .then(dbRes => res.status(dbRes).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    
    'updateFavAnime': (req, res) => {
        const { id } = req.params
        const { type, ranking } = req.body

        const halfPercent = .5;
        if(type === 'plus') ranking += halfPercent
        else if(type === 'minus') ranking -= halfPercent
        else return ranking
        sequelize.query(`
            update anime set ranking = ${ranking} where id = ${id} 
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    'deleteFavAnime': (req,res) => {
        const { id } = req.params;
        sequelize.query(`
            delete from anime where anime_id = ${id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
}