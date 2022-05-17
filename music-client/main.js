
const SERVER_ROOT = 'http://localhost:3000';

window.onload = function () {
    //document.getElementById("btn").onclick=addMusicToPlayList;
    if (localStorage.getItem('accessToken')) {

        afterLogin();

    } else {

        notLogin();

    }
    document.getElementById("sbn").onclick = function () {
        let Val;
        let searchInput = document.getElementById("search-input");
        let inputval = searchInput.value.toUpperCase();
        let table = document.getElementById("user-table");
        let tr = table.getElementsByTagName("tr");
        for (let i = 0; i < tr.length; i++) {
            let td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                Val = td.textContent || td.innerText;
                if (Val.toUpperCase().indexOf(inputval) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    };
    document.getElementById('loginBtn').onclick = function () {

        const username = document.getElementById('username').value;

        const password = document.getElementById('password').value;

        fetch(`${SERVER_ROOT}/api/auth/login`, {

            method: 'POST',

            body: JSON.stringify({

                username,

                password

            }),

            headers: {

                'Content-Type': 'application/json'

            }

        }).then(response => response.json())

            .then(data => loggedInFeatures(data));

    }
    document.getElementById('logoutBtn').onclick = function () {

        localStorage.removeItem('accessToken');

        notLogin();

    }
}

function loggedInFeatures(data) {

    if (data.status) {

        document.getElementById('errormessage').innerHTML = data.message;

    } else {

        document.getElementById('username').value = '';

        document.getElementById('password').value = '';

        localStorage.setItem('accessToken', data.accessToken);

        afterLogin();

    }

}
function fetchMusic() {

    fetch(`${SERVER_ROOT}/api/music`, {

        headers: {

            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`

        }

    })

        .then(response => response.json())

        // .then(songs => console.log(songs))
        .then(musicDB => {
            let html = `
                <table class="table" id="user-table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">title</th>
                        <th scope="col">ReleaseDate</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody id="table-body">
      
            `;
   //id="tr${music.id}"
            musicDB.forEach(music => {
                //console.log("in music", music)
                html += `
                    <tr >
                        <th scope="row">${musicDB.indexOf(music)}</th>
                        <td>${music.title}</td>
                        <td>${music.releaseDate}</td>
                        <td><button onclick="addToPlayList('${music.id}')" id= "btn"><img src="/CS445MapFinalProject/images/plus-512.webp" id="img"></button>
               `;
            });

            html += `
                </tbody>
            </table>
            `;
            document.getElementById('musics').innerHTML = html;
        });

}

function fetchPlayList() {
    fetch(`${SERVER_ROOT}/api/playlist`, {

        headers: {

            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`

        }

    })

        .then(response => response.json())

        // .then(songs => console.log(songs))
        .then(playlistDB => {
            let html = `
                <table class="table" id="user-table2">
                <thead>
                    <tr>
                        
                        <th scope="col">index</th>
                        <th scope="col">title</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody id="table-body">
      
            `;

            playlistDB.forEach(music => {
                html += `
                    <tr id="tr${music.id}">
                        <th scope="row">${playlistDB.indexOf(music)}</th>
                        <td>${music.title}</td>
                        
                        <td><button onClick="removeList('${music.songId}')"  id= "bttn" ><img src="/CS445MapFinalProject/images/Unknown.png" id="minussign"></button>
                         <button onClick="playMusic('${music.songId}')" id= "btnn" data-music="${music.songId}" ><img src="/CS445MapFinalProject/images/music.png" id="playmusic"></button>  </td>
               `;
            });

            html += `
                </tbody>
            </table>
            `;
            document.getElementById('playlist').innerHTML = html;
        });

}
function afterLogin() {

    document.getElementById('search').style.display = 'block';

    document.getElementById('logout-div').style.display = 'block';

    document.getElementById('login-div').style.display = 'none';
    document.getElementById('musics').style.display = 'block';
    document.getElementById('playlist').style.display = 'block';
    fetchMusic();

    fetchPlayList();

    document.getElementById('content').innerHTML = 'Content of the music';
    //document.getElementById('content').innerHTML = 'playlist';
}

function notLogin() {

    document.getElementById('search').style.display = 'none';

    document.getElementById('logout-div').style.display = 'none';

    document.getElementById('login-div').style.display = 'block';
    document.getElementById('musics').style.display = 'none';
    document.getElementById('playlist').style.display = 'none';
    document.getElementById('content').innerHTML = 'Welcome to MIU Station';

}
function addToPlayList(id) {
    console.log("id number", id)
    console.log("button", document.getElementById('btn'))

    fetch(`${SERVER_ROOT}/api/playlist/add`, {
        method: 'POST',
        body: JSON.stringify({
            songId: id
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`

        }
    }).then(response => response.json())
        .then(musics => {//musics
            console.log(musics, "in musics")
            let count = 2
            musics.forEach(music => {
                if (!playlistDB.includes(music.title)) {
                    if (music.title === title) {
                        count++
                        playlistDB.push(music.title);
                    }


                    html += `<tr>
         <th scope="row">${playlistDB.indexOf(music) + 1}</th>
      <td>${music.title}</td>                              
         <td><button id="bttn"
           onclick = "playMusic(${urlPath})"><img src="/CS445MapFinalProject/images/Unknown.png" id="minussign"                                 
         </button>
       <button id="btnn"
               onclick = "removeList(${music.songId})"><img src="/CS445MapFinalProject/images/music.png" id="playmusic">                                  
               </button>
              
               </td>
      </tr>`;
      document.getElementById('playlist').innerHTML = html;

                }
            })
        })
}

function removeList(songId,title){
    console.log("in title",title);
//console.log("in id", songId)
//document.getElementById('playlist').innerHTML='';
    fetch(`${SERVER_ROOT}/api/playlist/remove`, {
        method: 'POST',
        body: JSON.stringify({
            songId: songId
        }),
        headers: {
            
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
        }
        
    }).then(response => response.json())
        .then(musics => {//musics
            console.log(musics.length)
            //console.log(musics, "in musics")
            let count = -1;
            musics.forEach(music => {

                count++

               if(music.title !==title){

                   console.log("fn", music)

                   console.log(musics.length)

                   if(removeArr.indexOf(music) === -1){

                       removeArr.push(music)

                   }

                    html += `<tr>
         <th scope="row">${playlistDB.indexOf(music) + 1}</th>
      <td>${music.title}</td>                              
         <td><button id="bttn"
           onclick = "playMusic(${path})"><img src="/CS445MapFinalProject/images/Unknown.png" id="minussign"                                 
         </button>
       <button id="btnn"
               onclick = "removeList(${music.songId})"><img src="/CS445MapFinalProject/images/music.png" id="playmusic">                                  
               </button>
              
               </td>
      </tr>`;
      document.getElementById('playlist').innerHTML  = html;

                }
            })
        })
}



 function playMusic(path){
     console.log(path,"in play")
     let audio=document.getElementsByTagName("audio")[0];
     audio.setAttribute("src",`${SERVER_ROOT}/${path}`)
     document.getElementsByTagName("p")[0].innerHTML=`playing${path}`
     console.log(audio.src,"checking")
 }
    











        








