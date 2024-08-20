import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDtN-6_8_adIwoOsdlymqz3OQlLTIO51BA",
    authDomain: "valkiri-app.firebaseapp.com",
    databaseURL: "https://valkiri-app-default-rtdb.firebaseio.com",
    projectId: "valkiri-app",
    storageBucket: "valkiri-app.appspot.com",
    messagingSenderId: "28209650847",
    appId: "1:28209650847:web:65f73e68bedf8b43f516aa"
};
  
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

async function searchUserByUsername(username) {
  try {
    const guildSnapshot = await get(ref(db, 'guild'));
    if (guildSnapshot.exists()) {
      const guildData = guildSnapshot.val();
      for (const memberId in guildData) {
        if (guildData[memberId].username === username) {
          return {
            [memberId]: guildData[memberId]
          };
        }
      }
      return null;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error)
    return null;
  }
}

const searchInput = document.getElementById("search-input");

const searchButton = document.getElementById("search-button");

searchButton.addEventListener('click', () => {
  inputLogic();
})

function inputLogic(){
  if(searchInput.value.trim() === ""){
    searchInput.style.borderColor = "red";
    createDialog(false)
  }else if(searchInput.value.trim() !== ""){
    let searchInputValue = searchInput.value.trim();
    searchInput.style.borderColor = "red";
    searchUserByUsername(searchInputValue).then(
      (user) => {
        if(user){
          searchInput.style.borderColor = "green";
          const memberId = Object.keys(user)[0];
          const userData = user[memberId];
          createDialog(true, userData)
        }else if(!user){
          searchInput.style.borderColor = "red";
          const userData = null;
          createDialog(true, userData);
        }
      })
  }
}


function createDialog(statut, userData){
  const searchArea = document.getElementById('search-area');
  let searchAreaData = searchArea.innerHTML;
  searchArea.innerHTML = "";
  
  let warningMessage = "أدخل اللقب أولا!";
  let warningMessage2 = "لا يوجد عضو بهذا اللقب!";
  
  const dialog = document.createElement('div');
  
  if(statut){
    
    if(userData == null){
      
    const paragraph = document.createElement('p');
    
    paragraph.textContent = warningMessage2;
    
    dialog.appendChild(paragraph);
    
    } else {
      
    const usernameParagraph = document.createElement('p');
    const balanceParagraph = document.createElement('p');
    const warningsParagraph = document.createElement('p');
    const bagageParagraph = document.createElement('p');
    const shopBtn = document.createElement('button');
    
    usernameParagraph.textContent = `مرحبا بك ${userData.username}`;
    balanceParagraph.textContent = `لديك ${userData.balance} عملة`;
    warningsParagraph.textContent = `لديك ${userData.warnings} إنذار`;
    bagageParagraph.textContent = `السلع: ${userData.bagage}`;
    
    shopBtn.textContent = "المتجر";
    
    shopBtn.className = 'shop-btn';
    shopBtn.style.backgroundColor = "white";
    shopBtn.style.color = "black";
    shopBtn.style.fontSize = "18px";
    shopBtn.style.fontWeight = "600";
    
    dialog.appendChild(usernameParagraph);
    dialog.appendChild(balanceParagraph);
    dialog.appendChild(warningsParagraph);
    dialog.appendChild(bagageParagraph);
    dialog.appendChild(shopBtn);
    
    shopBtn.addEventListener('click', () => {
      window.location.href = "/shop"
    })
    
    }
    
  }else if (!statut){
    const paragraph = document.createElement('p');
    
    paragraph.textContent = warningMessage;
    
    dialog.appendChild(paragraph);
  }
    
  
  const confirmBtn = document.createElement('button');
  
  confirmBtn.textContent = "تأكيد";
  
  confirmBtn.className = 'confirm-btn';
  
  dialog.className = 'dialog';
  
  dialog.appendChild(confirmBtn);
  
  searchArea.appendChild(dialog);
  
  confirmBtn.addEventListener('click', () => {
    dialog.style.display = 'none';
    searchArea.innerHTML = searchAreaData;
  })
  
}