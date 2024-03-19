const searchTerm = document.querySelector('#search-term');
const button = document.querySelector('button');
const heading = document.querySelector('h1');
const trendingContainer = document.querySelector('#trending-container');
const singleAnimeContainer = document.querySelector('#single-anime');
const categoryContainer = document.querySelector('#category-container');
const animeInfoContainer = document.querySelector('#anime-info');
const favorites = document.querySelector('#favorites-container');
const favsIcon = document.querySelector('#favs');
const overlay = document.querySelector('#overlay');
let addFavoriteAnime;
let favoriteCard
let searchCard;
let infoCards;
let cards;

/******** GET Trending Anime And Display Trending Section ********/

// GET Trending Anime Function
const allTrending = () => {
	axios.get(
		"https://kitsu.io/api/edge/anime?trending&page[limit]=7"
	).then(res => {
        const data = res.data.data
        displayAllTrending(data)
    });
};
// Displays Trending Anime Cards
const displayAllTrending = (data) => {
    let trendingCardContainer = document.createElement('div')
    trendingCardContainer.classList.add('trending-card-container');

    let trendingTitle = document.createElement('div');
    trendingTitle.classList.add('trending-title');
    trendingTitle.innerHTML = `<h2>Trending</h2>`
    
    trendingContainer.appendChild(trendingTitle);
    
    data.map((attr) => {
        const infoCard = {
            id: attr.id,
            title: attr.attributes.canonicalTitle, 
            video: attr.attributes?.youtubeVideoId,
            description: attr.attributes.description,
            poster: attr.attributes.posterImage.medium,
            smallPoster: attr.attributes.posterImage.small,
            startDate: attr.attributes.startDate,
            ranking: attr.attributes.averageRating,
            rating: attr.attributes.ageRating,
            ageRating: attr.attributes.ageRatingGuide
        }

        let trendingCard = document.createElement('div');
        trendingCard.setAttribute('key', infoCard.id)
        trendingCard.classList.add('trending-card', 'card');
        trendingCard.innerHTML = `
        <img key=${infoCard.id} src=${infoCard.poster}
        <h4>${infoCard.title}</h4>
        <p>rated: ${infoCard.rating}</p>
        `
        trendingCardContainer.appendChild(trendingCard)
        trendingContainer.appendChild(trendingCardContainer)
        
        trendingCard.addEventListener('click', getAnimeInfo)
    })
};

/******** GET Single Anime And Display Single Anime Section ********/

// GET Single Anime Search Function
const searchAnime = () => {
    const animeSearch = searchTerm.value
	axios.get(
		`https://kitsu.io/api/edge/anime?filter[text]=${animeSearch}&page[limit]=1`
	).then(res => {
        const attr = res.data.data[0]
        searchTerm.value = ""
        console.log(attr)
        displaySearchAnime(attr)
    });
};
// Display Single Search Anime Card
const displaySearchAnime = (attr) => {
    const id = attr.id
        const description = attr.attributes.description;
        const animeTitle = attr.attributes.canonicalTitle;
        const rating = attr.attributes.ageRating;
        const poster = attr.attributes.posterImage.medium;
        const video = attr.attributes?.youtubeVideoId;
        
        let animeCardContainer = document.createElement('div')
        animeCardContainer.classList.add('single-anime-container');

        animeCardContainer.innerHTML = `
            <div key=${id} class="single-card card">
                <img key=${id} src=${poster}>
                <h4>${animeTitle}</h4>
                <p>rated: ${rating}</p>
                <div id="close">
                    <button onclick="closeCard(searchCard)"class="close-search">&times;</button>
                    Close
                </div>
            </div>
        `
        // animeCardContainer.appendChild(animeCard)
        singleAnimeContainer.innerHTML=""
        singleAnimeContainer.appendChild(animeCardContainer)
        
        animeCardContainer.addEventListener('click', getAnimeInfo)
        searchCard = document.getElementsByClassName('single-card')[0]
      
};

/******** GET Anime Categories And Display Categories Section ********/

// GET Anime Categories Function
const categoriesPage = () => {
    const titles = [
        "Action", "Comedy", "Josei", "Psychological", 
        "Isekai", "Supernatural", "Drama", "Cyberpunk"
    ];
    for(const title of titles) {
        axios.get(
            `https://kitsu.io/api/edge/anime?filter[categories]=${title}&page[limit]=8`
        ).then(res => {
            const data = res.data.data
            displayCatergoriesPage(data,title)
        })   
    }     
};
// Display Anime Categories Cards
const displayCatergoriesPage = (data,title) => {
    let animeCardContainer = document.createElement('div')
    animeCardContainer.classList.add('card-container');
    
    let categoryTitle = document.createElement('div');
    categoryTitle.classList.add('category-title');
    categoryTitle.innerHTML = `<h2>${title}</h2>`
    
    categoryContainer.appendChild(categoryTitle)

    data.map((attr) => {
        const id = attr.id
        const animeTitle = attr.attributes.canonicalTitle;
        const rating = attr.attributes.ageRating;
        const poster = attr.attributes.posterImage.medium;
        const video = attr.attributes?.youtubeVideoId;
        
        let animeCard = document.createElement('div');
        animeCard.setAttribute('key',id)
        animeCard.classList.add('anime-card', 'card');

        animeCard.innerHTML = `
            <img key=${id} src=${poster}>
            <h4>${animeTitle}</h4>
            <p>rated: ${rating}</p>
        `
        animeCardContainer.appendChild(animeCard) 
        categoryContainer.appendChild(animeCardContainer)

        animeCard.addEventListener('click', getAnimeInfo)
    })
};

// Call All Trending And Categories To Be Displayed On Page Load 
allTrending();
categoriesPage();

// Button Clicked To Search For Anime
button.addEventListener('click', searchAnime);

// GET Anime Info From User Selected Card
const getAnimeInfo = (evt) => {
    let id = evt.target.getAttribute('key')

    axios.get(`https://kitsu.io/api/edge/anime/${id}`)
    .then(res => {
        const info = res.data.data
        displayAnimeInfo(info,id)    
    })  
};
// Display Anime Info Card
const displayAnimeInfo = (info,id) => {
    const img = info.attributes.posterImage.large;
    const title = info.attributes.canonicalTitle;
    const date = info.attributes.startDate;
    const rating = info.attributes.ageRating;
    const ageGuide = info.attributes.ageRatingGuide;
    const ranking = info.attributes.averageRating;
    const description = info.attributes.description;
    const video = info.attributes.youtubeVideoId
    const htmlInfo = `
    <div class="info-container">
        <div key=${id} class="info-card">
            <img key=${id} src=${img}>
            <div class=info-ratings>
                <h2>${title}</h2>
                <p>Date: ${date}</p>
                <p>Rated: ${rating} "${ageGuide}"</p>
                <p class="house-price">$${ranking}</p>
            </div>
            <div class="info-desc">
                <span>Description:</span>
                <p>${description}</p>
            </div>
            <div class="options">
                <div id="add">
                    <button onclick="addToFavAnime(); animeSaved('${title}');" key=${id}>+</button>
                    Save
                </div>
                <iframe src="https://www.youtube.com/embed/${video}" 
                    frameborder="0" allowfullscreen>
                </iframe>
                <div id="close">
                    Close
                    <button onclick="closeCard(infoCards)" class="close-info">&times;</button>
                </div>
            </div>
        </div>
    </div>
    `
    animeInfoContainer.innerHTML = htmlInfo
    animeInfoContainer.scrollIntoView();
    infoCards = document.getElementsByClassName("info-card")[0]
};
const animeSaved = (title) => {
    alert(`${title}, has been saved to favorites`)
}
// Closes Anime Info Card
const closeCard = (info) => {
    const parentInfo = info.parentNode;
    parentInfo.removeChild(info)
    singleAnimeContainer.innerHTML=""
}


/********  SQL DataBase CRUD Functionality Section ********/

// ADD favorites from SQL DataBase
const addToFavAnime = (att) => {
    att = document.querySelector('.info-card');    
    const favAnime = { 
        id: att.getAttribute('key'),
        img: att.querySelector('img').getAttribute('src'),
        title: att.getElementsByTagName('h2')[0].innerText,
        rated: att.querySelectorAll('p')[1].innerText, 
        ranking: att.querySelectorAll('p')[2].innerText
    }
    axios.post('http://localhost:4001/addFavAnime', favAnime)
    .then(res => {
        console.log(res.data)
    })
};
// GET favorites From SQL DataBase AND Display favorites
const getFavAnime = () => {
    favorites.innerHTML = ""
    axios.get(`http://localhost:4001/getAllFavAnime`)
    .then(res => {
        res.data[0].map(fav => {
            if(!fav)return
    
            let favCardContainer = document.createElement('div');
            favCardContainer.classList.add('favorite-card-container')
            let favCard = document.createElement('div');
            favCard.classList.add('favorite-card');
            favCard.setAttribute('key',fav.anime_id);
    
            favCard.innerHTML =` 
                <div class="favorite-card-container">
                    <div key=${fav.anime_id} class="favorite-card card">
                        <img key=${fav.anime_id} src=${fav.img}>
                        <div class="favorite-ratings">
                            <h2>${fav.anime_title}</h2>
                            <p>Rated: ${fav.rated}</p>
                            <p>Ranking: ${fav.ranking}</p>
                            <div id="delete">
                                <button id="dte-btn" onclick="deleteFavAnime(${fav.anime_id}); closeCard(favoriteCard);">delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            ` 
            favCardContainer.appendChild(favCard)
            favorites.appendChild(favCardContainer)
            favoriteCard = document.getElementsByClassName('favorite-card')[0]
        })
    })
};
favsIcon.addEventListener('click', getFavAnime);

// DELETE favorite Anime From SQL DataBase
const deleteFavAnime = (id) => {
    axios.delete(`http://localhost:4001/deleteFavAnime/${id}`)
    .then(() => getFavAnime())
    .catch(err => console.log(err))
}

// UPDATE favorite Anime From SQL DataBase
const updateFavAnime = (id,type) => {
    console.log(id)
    axios.put(`http://localhost:4001/updateFavAnime/${id},${type}`)
    .then(() => getFavAnime())
    .catch(err => console.log(err))
}


