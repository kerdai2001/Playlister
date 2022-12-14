import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import AddSong_Transaction from '../transactions/AddSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import EditSong_Transaction from '../transactions/EditSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    YOUTUBE_SET_CURRENT_SONG: "YOUTUBE_SET_CURRENT_SONG",
    INIT_YOUTUBE_PLAYER: "INIT_YOUTUBE_PLAYER",
    EXPAND_CURRENT_LIST: "EXPAND_CURRENT_LIST",
    RELOAD_ID_NAME_PAIRS: "RELOAD_ID_NAME_PAIRS",
    ADD_LISTEN: "ADD_LISTEN",
    CHANGE_VIEW: "CHANGE_VIEW",
    SET_SEARCH: "SET_SEARCH",
    SET_SORT: "SET_SORT"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        youTubePlaylist: [],
        youTubeCurrentSong: 0,
        youTubePlayer: null,
        listExpanded: false,
        currentView: 0,         // 0 = home, 1 = all lists, 2 = users
        search: "",
        sort: 0                 // 0 = creation, 1 = update, 2 = name
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: store.currentView,
                    search: "",
                    sort: store.sort
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: [],
                    youTubeCurrentSong: 0,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: false,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: payload.youTubePlaylist,
                    youTubeCurrentSong: payload.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: payload.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                });
            }
            case GlobalStoreActionType.YOUTUBE_SET_CURRENT_SONG: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: payload.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                });
            }
            case GlobalStoreActionType.EXPAND_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: payload.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                });
            }
            case GlobalStoreActionType.INIT_YOUTUBE_PLAYER: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: payload.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                });
            }
            case GlobalStoreActionType.RELOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                });
            }
            case GlobalStoreActionType.ADD_LISTEN: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: payload.youTubePlaylist,
                    youTubeCurrentSong: payload.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: payload.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: store.sort
                });
            }
            case GlobalStoreActionType.CHANGE_VIEW: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: payload.currentView,
                    search: "",
                    sort: 0
                });
            }
            case GlobalStoreActionType.SET_SEARCH: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: store.currentView,
                    search: payload.search,
                    sort: store.sort
                });
            }
            case GlobalStoreActionType.SET_SORT: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    youTubePlaylist: store.youTubePlaylist,
                    youTubeCurrentSong: store.youTubeCurrentSong,
                    youTubePlayer: store.youTubePlayer,
                    listExpanded: store.listExpanded,
                    currentView: store.currentView,
                    search: store.search,
                    sort: payload.sort
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {

        if(newName == "") return;

        // test for duplicate name
        for(let i = 0; i < store.idNamePairs.length; i++)
        {
            // name already exists in a different playlist
            if(newName === store.idNamePairs[i].name && id !== store.idNamePairs[i]._id)
            {
                auth.showError("Playlist with name " + newName + " already exists.");
                return "error";
            }
        }

        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            
            if(!response.data.success) return;

            let playlist = response.data.playlist;
            playlist.name = newName;

            async function updateList(playlist) {
                response = await api.updatePlaylistById(playlist._id, playlist);
                if(!response.data.success) return;

                async function getListPairs() {
                    response = await api.getPlaylistPairs();
                    if(!response.data.success) return;

                    let pairsArray = response.data.idNamePairs;
                    store.restoreSort(store.sort, pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_LIST_NAME,
                        payload: {
                            idNamePairs: pairsArray
                        }
                    });
                }
                getListPairs();
            }
            updateList(playlist);
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        //history.push("/");
        //store.loadIdNamePairs();
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let number = store.newListCounter;
        let newListName = "Untitled " + number;

        async function asyncLoad() {
            let response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                for(let i = 0; i < pairsArray.length; i++)
                {
                    if(newListName === pairsArray[i].name)
                    {
                        number++;
                        newListName = "Untitled " + number;
                        i = 0;
                    }
                }

                response = await api.createPlaylist(
                    newListName,
                    [],
                    auth.user.email,
                    [],
                    auth.user.userName,
                    "",
                    0, 0, 0);

                console.log("createNewList response: " + response);
                if (response.status === 201) {
                    tps.clearAllTransactions();
                    let newList = response.data.playlist;
        
                    async function asyncLoadIdNamePairs() {
                        response = await api.getPlaylistPairs();
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            store.restoreSort(store.sort, pairsArray);
                            storeReducer({
                                type: GlobalStoreActionType.CREATE_NEW_LIST,
                                payload: {currentList: newList, idNamePairs: pairsArray}
                            });
                        }
                    }
                    asyncLoadIdNamePairs();
                }
                else {
                    console.log("API FAILED TO CREATE A NEW LIST");
                }

            }
        }
        asyncLoad();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                store.restoreSort(store.sort, pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {

                if(store.search == "")
                {
                    store.loadIdNamePairs();
                    return;
                }

                store.restoreSearch();
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    store.getErrorMessage = () => {
        return auth.error;
    }
    store.closeError = () => {
        auth.closeError();
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id, expand) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                var youTubePlaylist = [];
                for(let i = 0; i < playlist.songs.length; i++)
                    youTubePlaylist.push(playlist.songs[i].youTubeId);

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {
                        currentList: playlist,
                        youTubePlaylist:youTubePlaylist,
                        youTubeCurrentSong: 0,
                        listExpanded: expand}
                });
                //history.push("/playlist/" + playlist._id);
                tps.clearAllTransactions();
                
                if(playlist.published == "") return;
                
                playlist.listens++;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if(!response.data.success) return;

                    async function asyncReloadIdNamePairs() {
                        
                        if(store.search == "")
                            response = store.currentView == 0 ? await api.getPlaylistPairs() : await api.getPublishedPlaylists();
                        else
                        {
                            switch(store.currentView)
                            {
                                case 0:
                                    response = await api.searchHome(store.search);
                                    break;
                                case 1:
                                    response = await api.searchByPlaylist(store.search);
                                    break;
                                case 2:
                                    response = await api.searchByUser(store.search);
                                    break;
                            }
                        }
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            store.restoreSort(store.sort, pairsArray);
                            storeReducer({
                                type: GlobalStoreActionType.ADD_LISTEN,
                                payload: {
                                    idNamePairs: pairsArray,
                                    currentList: playlist,
                                    youTubePlaylist: youTubePlaylist,
                                    youTubeCurrentSong: 0,
                                    listExpanded: expand}
                            });
                        }
                    }
                    asyncReloadIdNamePairs();
                }
                updateList(playlist);
            }
        }
        asyncSetCurrentList(id);
    }

    // TRANSACTIONS ////////////////////////////////

    store.addNewSong = function() {
        let playlist = store.currentList;
        playlist.songs.push({title: "Untitled", artist: "Unknown", youTubeId: "dQw4w9WgXcQ"});
        store.updateCurrentList();
    }

    store.removeNewSong = function() {
        let playlist = store.currentList;
        playlist.songs.pop();
        store.updateCurrentList();
    }

    store.removeSong = function(index) {
        let playlist = store.currentList;
        playlist.songs.splice(index, 1); 
        store.updateCurrentList();
    }

    store.addSong = function(index, song) {
        let playlist = store.currentList;
        playlist.songs.splice(index, 0, song);
        store.updateCurrentList();
    }

    store.editSong = function(index, song) {
        let playlist = store.currentList;
        playlist.songs[index] = song;
        store.updateCurrentList();
    }

    store.moveSong = function(start, end) {
        let list = store.currentList;

        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        store.updateCurrentList();
    }
    
    store.addAddNewSongTransaction = function() {
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction);
    }

    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }

    store.addEditSongTransaction = function (index, newSong) {
        let song = store.currentList.songs[index];
        let oldSong = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new EditSong_Transaction(store, index, oldSong, newSong);
        tps.addTransaction(transaction);
    }

    store.addMoveSongTransaction = function (start, end) {
        if(start == end) return;
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }

    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);

            var youTubePlaylist = [];
                for(let i = 0; i < store.currentList.songs.length; i++)
                    youTubePlaylist.push(store.currentList.songs[i].youTubeId);

            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {
                        currentList: store.currentList,
                        youTubePlaylist: youTubePlaylist,
                        youTubeCurrentSong: store.youTubeCurrentSong,
                        listExpanded: store.listExpanded}
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }

    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // YOUTUBE ////////////////////////////////

    store.youTubeSetCurrentSong = function(index) {
        storeReducer({
            type: GlobalStoreActionType.YOUTUBE_SET_CURRENT_SONG,
            payload: {youTubeCurrentSong: index}
        });
    }

    store.nextSong = function() {
        store.youTubeSetCurrentSong((store.youTubeCurrentSong + 1) % store.currentList.songs.length);
    }

    store.prevSong = function() {
        store.youTubeSetCurrentSong((store.youTubeCurrentSong + store.currentList.songs.length - 1) % store.currentList.songs.length);
    }

    store.initYouTubePlayer = function(player) {
        storeReducer({
            type: GlobalStoreActionType.INIT_YOUTUBE_PLAYER,
            payload: {youTubePlayer: player}
        });
    }

    store.toggleListExpanded = function() {
        let state = !store.listExpanded;
        storeReducer({
            type: GlobalStoreActionType.EXPAND_CURRENT_LIST,
            payload: {listExpanded: state}
        });
    }

    store.addComment = function(text) {
        store.currentList.comments.push({ userName: auth.user.userName, comment: text });
        store.updateCurrentList();
    }

    store.publishList = function() {
        tps.clearAllTransactions();
        store.currentList.published = (new Date()).toLocaleString('en-us', {year:"numeric", month:"short", day:"numeric"});
        
        async function asyncUpdateCurrentList() {
            let response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {
                        currentList: store.currentList,
                        youTubePlaylist: store.youTubePlaylist,
                        youTubeCurrentSong: store.youTubeCurrentSong,
                        listExpanded: store.listExpanded}
                });
                async function asyncReloadIdNamePairs() {

                    if(store.search == "")
                        response = await api.getPlaylistPairs();
                    else
                    {
                        switch(store.currentView)
                        {
                            case 0:
                                response = await api.searchHome(store.search);
                                break;
                            case 1:
                                response = await api.searchByPlaylist(store.search);
                                break;
                            case 2:
                                response = await api.searchByUser(store.search);
                                break;
                        }
                    }
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        store.restoreSort(store.sort, pairsArray);
                        storeReducer({
                            type: GlobalStoreActionType.RELOAD_ID_NAME_PAIRS,
                            payload: pairsArray
                        });
                    }
                }
                asyncReloadIdNamePairs();
            }
        }
        asyncUpdateCurrentList();
    }

    store.addLike = function(id) {
        async function asyncAddLike(id) {
            let response = await api.getPlaylistById(id);
            
            if(!response.data.success) return;

            let playlist = response.data.playlist;
            playlist.likes++;

            async function updateList(playlist) {
                response = await api.updatePlaylistById(playlist._id, playlist);
                if(!response.data.success) return;

                async function asyncReloadIdNamePairs() {
                    if(store.search == "")
                        response = store.currentView == 0 ? await api.getPlaylistPairs() : await api.getPublishedPlaylists();
                    else
                    {
                        switch(store.currentView)
                        {
                            case 0:
                                response = await api.searchHome(store.search);
                                break;
                            case 1:
                                response = await api.searchByPlaylist(store.search);
                                break;
                            case 2:
                                response = await api.searchByUser(store.search);
                                break;
                        }
                    }
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        store.restoreSort(store.sort, pairsArray);
                        storeReducer({
                            type: GlobalStoreActionType.RELOAD_ID_NAME_PAIRS,
                            payload: pairsArray
                        });
                    }
                }
                asyncReloadIdNamePairs();
            }
            updateList(playlist);
        }
        asyncAddLike(id);
    }

    store.addDislike = function(id) {
        async function asyncAddDislike(id) {
            let response = await api.getPlaylistById(id);
            
            if(!response.data.success) return;

            let playlist = response.data.playlist;
            playlist.dislikes++;

            async function updateList(playlist) {
                response = await api.updatePlaylistById(playlist._id, playlist);
                if(!response.data.success) return;

                async function asyncReloadIdNamePairs() {
                    if(store.search == "")
                        response = store.currentView == 0 ? await api.getPlaylistPairs() : await api.getPublishedPlaylists();
                    else
                    {
                        switch(store.currentView)
                        {
                            case 0:
                                response = await api.searchHome(store.search);
                                break;
                            case 1:
                                response = await api.searchByPlaylist(store.search);
                                break;
                            case 2:
                                response = await api.searchByUser(store.search);
                                break;
                        }
                    }
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        store.restoreSort(store.sort, pairsArray);
                        storeReducer({
                            type: GlobalStoreActionType.RELOAD_ID_NAME_PAIRS,
                            payload: pairsArray
                        });
                    }
                }
                asyncReloadIdNamePairs();
            }
            updateList(playlist);
        }
        asyncAddDislike(id);
    }

    store.duplicateList = async function (playlist) {
        let number = 1;
        let newListName = playlist.name;

        async function asyncLoad() {
            let response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;

                for(let i = 0; i < pairsArray.length; i++)
                {
                    if(newListName === pairsArray[i].name)
                    {
                        number++;
                        newListName = playlist.name + " " + number;
                        i = 0;
                    }
                }

                response = await api.createPlaylist(
                    newListName,
                    playlist.songs,
                    auth.user.email,
                    [],
                    auth.user.userName,
                    "",
                    0, 0, 0);
                if (response.status === 201) {
                    tps.clearAllTransactions();

                    if(store.currentView) return;

                    async function asyncLoadIdNamePairs() {

                        if(store.search == "")
                            response = await api.getPlaylistPairs();
                        else
                        {
                            switch(store.currentView)
                            {
                                case 0:
                                    response = await api.searchHome(store.search);
                                    break;
                                case 1:
                                    response = await api.searchByPlaylist(store.search);
                                    break;
                                case 2:
                                    response = await api.searchByUser(store.search);
                                    break;
                            }
                        }

                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            store.restoreSort(store.sort, pairsArray);
                            storeReducer({
                                type: GlobalStoreActionType.CREATE_NEW_LIST,
                                payload: {currentList: playlist, idNamePairs: pairsArray}
                            });
                        }
                    }
                    asyncLoadIdNamePairs(); 
                }
            }
        }
        asyncLoad();
    }

    store.setSort = function(index, list) {
        store.restoreSort(index, list);
        storeReducer({
            type: GlobalStoreActionType.SET_SORT,
            payload: {sort: index}
        });
    }

    store.restoreSort = function(index, list) {
        switch(index)
        {
            case 0:
                store.sortByCreate(list);
                break;
            case 1:
                store.sortByPublished(list);
                break;
            case 2:
                store.sortByUpdate(list);
                break;
            case 3:
                store.sortByName(list);
                break;
            case 4:
                store.sortByListens(list);
                break;
            case 5:
                store.sortByLikes(list);
                break;
            case 6:
                store.sortByDislikes(list);
                break;
        }
    }

    store.sortByCreate = function(list) {
        list.sort(
            function(x, y) {
                if(x.createdAt < y.createdAt) return -1;
                if(x.createdAt > y.createdAt) return 1;
                return 0;
            }
        )
    }

    store.sortByPublished = function(list) {
        list.sort(
            function(x, y) {
                if(Date.parse(x.published) < Date.parse(y.published)) return -1;
                if(Date.parse(x.published) > Date.parse(y.published)) return 1;
                return 0;
            }
        )
    }

    store.sortByUpdate = function(list) {
        list.sort(
            function(x, y) {
                if(x.updatedAt < y.updatedAt) return -1;
                if(x.updatedAt > y.updatedAt) return 1;
                return 0;
            }
        )
    }

    store.sortByName = function(list) {
        list.sort(
            function(x, y) {
                if(x.name < y.name) return -1;
                if(x.name > y.name) return 1;
                return 0;
            }
        )
    }

    store.sortByListens = function(list) {
        list.sort(
            function(x, y) {
                if(x.listens < y.listens) return 1;
                if(x.listens > y.listens) return -1;
                return 0;
            }
        )
    }

    store.sortByLikes = function(list) {
        list.sort(
            function(x, y) {
                if(x.likes < y.likes) return 1;
                if(x.likes > y.likes) return -1;
                return 0;
            }
        )
    }

    store.sortByDislikes = function(list) {
        list.sort(
            function(x, y) {
                if(x.dislikes < y.dislikes) return 1;
                if(x.dislikes > y.dislikes) return -1;
                return 0;
            }
        )
    }

    store.changeView = function(index) {
        store.closeCurrentList();
        async function asyncLoadIdNamePairs() {
            let response = index > 0 || store.isGuest() ? await api.getPublishedPlaylists() : await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_VIEW,
                    payload: {idNamePairs: pairsArray, currentView: index}
                });
            }
        }
        asyncLoadIdNamePairs();
    }

    store.loadPublishedNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPublishedPlaylists();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                store.restoreSort(store.sort, pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
        }
        asyncLoadIdNamePairs();
    }

    store.isGuest = function() {
        return auth.isGuest();
    }

    store.logout = function() {
        tps.clearAllTransactions();
        store.changeView(0);
    }

    store.searchHome = function(input) {
        async function asyncLoadIdNamePairs() {
            if(input == false)
            {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: []
                });
                return;
            }
            const response = await api.searchHome(input);
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                store.restoreSort(store.sort, pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.SET_SEARCH,
                    payload: {idNamePairs: pairsArray, search: input}
                });
            }
        }
        asyncLoadIdNamePairs();
    }

    store.searchByPlaylist = function (input) {
        async function asyncLoadIdNamePairs() {
            if(input == false)
            {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: []
                });
                return;
            }
            const response = await api.searchByPlaylist(input);
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                store.restoreSort(store.sort, pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.SET_SEARCH,
                    payload: {idNamePairs: pairsArray, search: input}
                });
            }
        }
        asyncLoadIdNamePairs();
    }

    store.searchByUser = function (input) {
        async function asyncLoadIdNamePairs() {
            if(input == false)
            {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: []
                });
                return;
            }
            const response = await api.searchByUser(input);
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                store.restoreSort(store.sort, pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.SET_SEARCH,
                    payload: {idNamePairs: pairsArray, search: input}
                });
            }
        }
        asyncLoadIdNamePairs();
    }

    store.restoreSearch = function() {
        switch(store.currentView) {
            case 0:
                store.searchHome(store.search);
                break;
            case 1:
                store.searchByPlaylist(store.search);
                break;
            case 2:
                store.searchByUser(store.search);
                break;
        }
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };