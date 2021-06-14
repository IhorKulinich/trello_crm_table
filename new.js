//
// GOOGLE APPS SCRIPT ONLY ( BASED ON JAVASCRIPT )
//

const table = SpreadsheetApp.openById("TABLE ID");

const workflow = table.getSheetByName("LIST OF CARDS NAME"); 
const dop = table.getSheetByName("LIST OF STATISTIC NAME"); 

const tech = table.getSheetByName("TECH LIST");
const keyword = table.getSheetByName("LIST OF KEYWORDS 1");
const projwords = table.getSheetByName("LIST OF KEYWORDS 2");
//open google table lists by id of the table and names of the lists

const doc = DocumentApp.openById("LOGGER_DOCUMENT_ID").getBody();
const history = DocumentApp.openById("HISTORY_DOCUMENT_ID").getBody();
//open google docs by ids and get acces to the class which contain texts and others

const idm = "ID_OF_PARSING_MODEL";
//board id

const whid = 'WEBHOOK_ID';
//get after running function setWebhook

function setWebHook() {
  
  var webhook = new Trello( idm , "DESCRIPTION" );
  
  webhook.set();
  
}

function getWebHook() {
  
  var webhook = new Trello( null , null );
  
  webhook.getModel = whid;
  
}

class Trello {

  constructor( idm , desc ){
    
    this.token = 'YOUR_TRELLO_TOKEN';
    
    this.url = "https://api.trello.com/1/tokens/" + this.token + "/webhooks/";
    
    this.key = 'YOUR_TRELLO_KEY';
    
    this.callbackURL = "GOOGLE_APPS_SCRIPT_WEB_APPLICATION_CALLBACK"; 
    
    this.idm = idm;
    
    this.desc = desc;
    
    this.other = "&customFieldItems=true&fields=all&actions=all&action_fields=all&actions_limit=1000&cards=all&card_fields=all&card_attachments=true&lists=all&list_fields=all&members=all&member_fields=all&checklists=all&checklist_fields=all&organization=false";
    //options of available data in getting json
  
  }
  
  set(){

    var my = this;
    
    var data = {
      
      method: 'POST', 
      
      contentType: 'application/json',
      
      muteHttpExceptions: true
      
    }
    
    var response = UrlFetchApp.fetch( my.url + "?key=" + my.key + "&callbackURL=" + my.callbackURL + "&idModel=" + my.idm + "&description=" + my.desc + my.other, data );
    //UrlFetchApp - class of google apps script modules that can fetch urls with options
    //UrlFetchApp.fetch - method of my class
    
    if (response.getResponseCode() == 200) {
      
      Logger.log( JSON.parse( response.getContentText() ) );
      
      my.getAll();
      
    } else {
      
      Logger.log( 'response status is ' + response.getResponseCode() );
      
      Logger.log( 'response ct is ' + response.getContentText() );
      //console.logs
      
    }
  
  }
  
  get( data ){
    
    var subdata = {
      
      method: 'GET', 
      
      headers: {
        
        'Accept': 'application/json'
        
      }
      
    }
    
    var my = this;
    
    var url = data.token ? data.url + "?token=" + my.token + "&key=" + my.key : data.url + "?key=" + my.key;
    
    var response = UrlFetchApp.fetch( url , subdata );
    //UrlFetchApp - class of google apps script modules that can fetch urls with options
    //UrlFetchApp.fetch - method of my class
    
    Logger.log( response.getResponseCode() );
    //console.logs
    
    return JSON.parse( response.getContentText() );
  
  }
  
  set getModel( id ){
    
    var my = this;
    
    this.get ( { url: my.url + id, token: false } );
  
  }
  
  getAll(){
    
    var my = this;
    
    var json = this.get( { url: my.url, token: false } );
    
    Logger.log(json);
    
    Logger.log(json.map( item => { item.id + ":" + item.desc } ) );
    
    return json.map( item => item.id );
    
  }
  
  set del( id ){

    var my = this;
    
    var data = {
      
      method: 'DELETE', 
      
      headers: {
        
        'Accept': 'application/json'
        
      }
      
    }
    
    var subresponse = UrlFetchApp.fetch( my.url + id + "?key=" + my.key , data );
    
  }
  
  delAll() {

    var my = this;
    
    var ids = my.getAll();
    
    ids.forEach( item => my.del = item );
    
  }
  
  set push ( data ) {

    var my = this;
    
    var subdata = {
      
      "method": "PUT",
      
      "contentType": "application/json",
      
      "payload": JSON.stringify( data.data )
      
    };
    
    history.appendParagraph( JSON.stringify( subdata ) );
      
    var response = UrlFetchApp.fetch( data.url + my.key + "&token=" + my.token , subdata );
  
  }
  
}

class Name {
  
  constructor( action , parent ) { 
    
    this.action = action;
    
    this.newRow = ROW_NUMBER;
    
    this.list = "data" in this.action ? "list" in this.action.data ? this.action.data.list.name : null : null; 
    
    this.trekedLists = [];//["TREKED LIST 1", "TREKED LIST 2"];
    
    this.colors = [];
    
    var i = 0;
    
    while( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER + 1 ).getValue() != "" ) { 
      
      this.trekedLists.push( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER + 1 ).getValue() ); 
      
      this.colors.push( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER + 2 ).getValue() ); 
      
      i++;
    
    }
    
    this.listNames = []; //["LIST 1"].concat( this.trekedList );
    
    var i = 0;
    
    while( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue() != "" ) { 
      
      this.listNames.push( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue() ); 
      
      i++;
    
    }
    
    this.listNames = this.listNames.concat( this.trekedList ); 
    
    this.id = "data" in this.action ? "card" in this.action.data ? this.action.data.card.id : null : null; 
    
    this.url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null; 
    
    this.name = "data" in this.action ? "card" in this.action.data ? this.action.data.card.name : null : null;
    
    this.date = "date" in this.action ? this.action.date : null;
    
    this.parent = parent;
    
    this.data = null; 
    
    this.searched = null;
    
  }
  
  createCard() {
    
    try{

      var my = this;
      
      if( my.listNames.indexOf( my.list ) != -1 ){
        
        workflow.insertRowBefore( my.newRow );
        //insert row in the table with cards before 4th row
        
        for ( var i = 1 ; i <= COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ; i++ ) {
          
          workflow.getRange( my.newRow , i ).setBackground( 'white' );
          
        }
        //and set white color of cells in my row
        
        workflow.getRange( my.newRow , COLUMN_NUMBER ).setValue( my.parent.link( my.url + '";"' + my.name ) );
        //getRange - method of the table class that take cell in my table and have methods
        //setValue - print something to the cell
        //link - function in the bottom of the code after functions deobjecter and deletewebhooks that set
        //google table formula  - hyperlink with url and text
        
        workflow.getRange( my.newRow , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).setValue( my.url );
        
        workflow.getRange( my.newRow , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).setValue( my.id );
        
        var time = new Date( my.date );
        
        workflow.getRange( my.newRow , COLUMN_NUMBER ).setValue( time );
        
        var coloring = function (){
          
          for ( var i = 1; i <= COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ; i++ ){
            
            workflow.getRange( my.newRow , i ).setBackground( my.colors[ my.trekedLists.indexOf( my.list ) ] );
            
          }
          
        };
        
        my.trekedLists.indexOf( my.list ) != -1 ? coloring() : null;
        
        my.isKey();
        //isKey - method that automaticaly set custom field item values if in the name of the card searched some key words
        
        history.appendParagraph( "name: " + my.name + ", url: " + my.url + ", id: " + my.id + ", date: " + my.date + ", list: " + my.list );
        
      }
      
    } catch (er){

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
      
      this.parent.error = { message: er.toString() , log: "createCard : ", url: url + ": " };
      
    }
    
  }
  
  rename(){ 
  
    try{

      var my = this;
      
      var row = my.parent.isRow( my.id );
      
      if ( row != null ){
        
        var due = workflow.getRange( row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue();
                
        due = due === "" ? "" : due !="" && due != "?" ? new Date( due ) : "?";
        
        var members = workflow.getRange( row , COLUMN_NUMBER ).getValue();
        
        members = members.indexOf(", ") != -1 ? members.splice(", ") : [members];
       
        due = due === "" && members[0] != "" ? "?" : due;
        
        if ( due != "" ){
          
          var year = new Date().getFullYear();
       
          my.data = { row: row, due: due, year: year, name: my.name, del: false };
          
          my.members[0] != "" ? my.members.forEach( user =>  { my.data["user"] = user; my.parent.DopTable = my.data } ) : null;
          
        }
                
        workflow.getRange( my.row , COLUMN_NUMBER ).setValue( my.parent.link( my.url + '";"' + my.name ) );
        
      }
      
      history.appendParagraph( "rename: " + my.name );
      
    } catch (er) {

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
    
      this.parent.error = { message: er.toString() , log: "setItems : ", url: url + ": "  };
    
    }
  
  }
  
  isKey(){
    
    try{

      var my = this;
      
      my.searchKey = { table: keyword, name: my.name, type: "text", id: "CUSTOM_FIELD_ID", cardId: my.id };
      
      my.searchKey = { table: projwords, name: my.name, type: "idValue", id: "CUSTOM_FIELD_ID", cardId: my.id };
      
    } catch (er) {

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
      
      this.parent.error = { message: er.toString() , log: "isKey : ", url: url + ": "  };
      
    }
  
  }
  
  set searchKey( search ){
    
    try{

      var my = this;
      
      var filter = (word) => ( word.indexOf(",") != -1 || word.indexOf(".") != -1 ) ? word.indexOf(".") != -1 ? word.replace(".", "") : word.indexOf(",") != -1 ? word.replace(",", "") : word : word;

      var string = search.name.indexOf(" ") != -1 ? search.name.split(" ").map( filter ) : [search.name];
      
      string = string.filter( word => search.table.createTextFinder( word ).findAll().length != 0 );
      
      string = string.length != 0 ? string[0] : null;
      
      if ( string != null ) {
      
        my.searched = search.table.createTextFinder( string ).findAll().filter( obj => obj.getValue() === string )[0];
          
        my.searched = search.table.getRange( 1 , my.searched.getColumn() ).getValue();
          
        my.parent.setItem = { type: search.type, value: my.searched, id: search.id, cardId: search.cardId };
        
      }
      
    } catch (er) {

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
      
      this.parent.error = { message: er.toString() , log: "searchKey : ", url: url + ": " };
      
    }
    
  }
  
}

class Item {
  
  constructor( action , parent ) {  

    this.parent = parent;

    var webhook = new Trello( null , null );
    
    this.fields = webhook.get( { url: "https://api.trello.com/1/boards/" + idm + "/customFields", token: true } );
    
    this.action = action;
    
    this.fieldsColumnStart = COLUMN_NUMBER;
    
    this.id = "data" in this.action ? "card" in this.action.data ? this.action.data.card.id : null : null; 
    
    this.name = "data" in this.action ? "card" in this.action.data ? this.action.data.card.name : null : null;
    
    this.fieldType = "data" in this.action ? "customField" in this.action.data ? this.action.data.customField.type : null : null;
    
    this.fieldName = "data" in this.action ? "customField" in this.action.data ? this.action.data.customField.name : null : null;
    
    this.fieldId = "data" in this.action ? "customFieldItem" in this.action.data ? this.action.data.customFieldItem.idCustomField : null : null;
    
    this.fieldValue = "data" in this.action ? "customFieldItem" in this.action.data ? "value" in this.action.data.customFieldItem ? "text" in this.action.data.customFieldItem.value ? this.action.data.customFieldItem.value.text : "" : "idValue" in this.action.data.customFieldItem ? this.action.data.customFieldItem.idValue : "" : "" : "";
    
    this.fieldColumn = null;
    
    this.fieldCount = tech.getRange( 1 , 1 ).getValue();
    
    this.index = null;
    
    this.row = null;
    
  }
  
  getItem(){
    
    try{

      var my = this;
      
      switch( my.fieldType ){
          
        case "text":
          
          my.customField();
          
          break;
          
        case "list":
          
          var customField = my.fields.filter( obj => obj.id === my.fieldId )[0];
          //becouse there are in the object of current variants of values of list field 
          
          my.fieldValue = "options" in customField ? customField.options.filter( obj => obj.id === my.fieldValue )[0].value.text : "";
          //and text of my searched values
          
          my.customField();
          
          break;
          
      }
      
    } catch (er) {

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
      
      this.parent.error = { message: er.toString() , log: "getItem : ", url: url + ": " };
      
    }
    
  }
  
  customField() {
    
    try{

      var my = this;
      
      my.index = my.fields.map( (obj , index) => { var searched = obj.type === "text" && obj.name === my.fieldName ? index : null; return searched } )[0];
      
      if ( my.index > my.fieldCount ) {
        
        for ( var i = 0 ; i < my.fields.length - my.fieldCount ; i++ ){
          
          workflow.insertColumnAfter( my.fieldsColumnStart + my.fieldCount );
          
          workflow.getRange ( ROW_NUMBER , my.fieldsColumnStart + my.fieldCount + i ).setValue( fields[ my.fieldCount + i ].name )
          
        }
        
        tech.getRange( 1 , 1 ).setValue( my.fields.length );
        
        var telegf = new Telegram();

        telegf.sendMessage = "new fields, count: " + my.fields.length.toString() - my.fieldCount.toString() ;
        
      }
      
      my.fieldColumn = my.fieldsColumnStart + my.index;
      
      my.row = my.parent.isRow( my.id );
      
      my.row != null ? workflow.getRange( my.row , my.fieldColumn ).setValue( my.fieldValue ) : null;
      
      history.appendParagraph( "field type: " + my.action.fieldType + ", column: " + my.fieldColumn + ", value: " + my.fieldValue );
      
    } catch (er) {

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
      
      this.parent.error = { message: er.toString() , log: "customField : ", url: url + ": " };
      
    }
    
  }
  
  set setItem( data ){
    
    try{

      var my = this;
      
      var subdata = {};
      
      switch( data.type ){
          
        case "text":
          
          subdata["value"] = {};
          
          subdata["value"]["text"] = data.value;
          
          break;
          
        case "idValue":
          
          subdata["idValue"] = data.value;
          
          break;
          
      }
      
      var webhook = new Trello( null , null );
      
      webhook.push = { url: 'https://api.trello.com/1/cards/' + data.cardId + "/customField/" + data.id + "/item?key=", data: subdata }
      
    } catch (er) {

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
      
      this.parent.error = { message: er.toString() , log: "setItems : ", url: url + ": " };
      
    }
    
  }
  
}

class List {
  
  constructor( action , parent ) { 
    
    this.action = action;
    
    this.list = "data" in this.action ? "list" in this.action.data ? this.action.data.list.name : null : null; 
    
    this.trekedLists = [];//["TREKED LIST 1", "TREKED LIST 2"];
    
    this.colors = [];
    
    var i = 0;
    
    while( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER + 1 ).getValue() != "" ) { 
      
      this.trekedLists.push( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER + 1 ).getValue() ); 
      
      this.colors.push( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER + 2 ).getValue() ); 
      
      i++;
    
    }
    
    this.listNames = []; //["LIST 1"].concat( this.trekedList );
    
    var i = 0;
    
    while( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue() != "" ) { 
      
      this.listNames.push( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue() ); 
      
      i++;
    
    }
    
    this.listNames = this.listNames.concat( this.trekedList ); 
    
    this.listAfter = "data" in this.action ? "listBefore" in this.action.data ? this.action.data.listAfter.name : null : null;
    
    this.id = "data" in this.action ? "card" in this.action.data ? this.action.data.card.id : null : null; 
    
    this.url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null; 
    
    this.name = "data" in this.action ? "card" in this.action.data ? this.action.data.card.name : null : null;
    
    this.date = null; 
    
    this.year = null;
    
    this.parent = parent;
    
    this.del = null; 
    
    this.data = null;
    
  }
  
  change(){
  
    try{

      var my = this;
      
      if ( my.trekedLists.indexOf( my.listAfter ) != -1 ) {
        
        my.date = new Date();
        
        var row = my.parent.isRow( my.id );
        
        if ( row != null ){
          
          workflow.getRange( row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).setValue( my.date );
          
          for (var i = 1 ; i <= 3 + tech.getRange( 1 , 1 ).getValue() ; i++ ) {
            
            workflow.getRange( row , i ).setBackground( my.colors[ my.trekedLists.indexOf( my.listAfter ) ] );
            
          }
          
          var members = workflow.getRange( row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue();
          
          members = members.indexOf(", ") != -1 ? members.split(", ") : [members];
          
          var due = workflow.getRange( row , COLUMN_NUMBER ).getValue();
          
          if ( due != "" && members[0] != "" ){
            
            my.year = new Date().getFullYear();
            
            my.data = { row: row, due: due, year: my.year, name: my.name, del: true };
            
            members.forEach( user => { my.data["user"] = user; my.parent.DopTable = my.data } );
            
          }
          
        }
      
      }
      
      history.appendParagraph( "list after: " + my.listAfter );
      
    } catch (er) {

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
    
      this.parent.error = { message: er.toString() , log: "change list : ", url: url + ": " };
    
    }
  
  }
  
  rename(){
    
    try{

      var my = this;
      
      var old = my.action.data.old.name;
      
      var search = tech.createTextFinder( old ).findAll().filter( obj => obj.getValue() === old );
      
      if ( search.length != 0 ) {
      
        search.forEach( item => tech.getRange( item.getRow() , item.getColumn() ).setValue( my.list ) );
        
      }
      
    } catch (er) {

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
      
      this.parent.error = { message: er.toString() , log: "rename list : ", url: url + ": " };
      
    }
  
  }
  
}

class Due {
  
  constructor( action , parent ) { 
    
    this.action = action;
    
    this.id = "data" in this.action ? "card" in this.action.data ? this.action.data.card.id : null : null; 
    
    this.url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null; 
    
    this.name = "data" in this.action ? "card" in this.action.data ? this.action.data.card.name : null : null;
    
    this.due = "data" in this.action ? "card" in this.action.data ? "due" in this.action.data.card ? this.action.data.card.due != null ? this.action.data.card.due : null : null : null : null;
    
    this.data = null;
    
    this.parent = parent;
    
    this.year = null;
    
  }
  
  set(){
    
    try{

      var my = this;
      
      my.year = new Date( my.due );
      
      my.year =  my.year.getFullYear();
      
      var row = my.isRow( my.id );
      
      if ( row != null ){
        
        workflow.getRange( row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).setValue( my.due );
        
        var members = workflow.getRange( row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue();
        //in my cell are member of my card
        
        members = members.indexOf(", ") != -1 ? members.splice(", ") : [members];
        //we look are there some members or just one
    
        my.data = { row: row, due: my.due, year: my.year, name: my.name, del: false };
                     
        members[0] != "" ? members.forEach( user => { my.data["user"] = user; my.parent.DopTable = my.data; } ) : null;
        //doppush - is function that maybe write to the dop table 
        //link to my card with text - deadline of my card or "?", defice and name
        //to the rows similar to the members of that board
        //and in that case - doesn't delete it
        
        history.appendParagraph( "due: " + my.due + ", members: " + members );
        
      }
      
    } catch (er) {

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
      
      this.parent.error = { message: er.toString() , log: "set due : ", url: url + ": " };
      
    }
    
  }
  
}

class Member {
  
  constructor( members , action , parent ) { 
    
    this.members = members;
    
    this.action = action;
        
    this.member = "member" in this.action ? actions.member : null;
    
    this.newusers = null;
    
    this.delete = this.action.type === "removeMemberFromCard" ? true : false;
    
    this.id = "data" in this.action ? "card" in this.action.data ? this.action.data.card.id : null : null; 
    
    this.url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null; 
    
    this.name = "data" in this.action ? "card" in this.action.data ? this.action.data.card.name : null : null;
    
    this.parent = parent;
    
    this.data = null;
    
    this.user = null;
    
  }
  
  reMember(){
  
    try{

      var my = this;
      
      my.row = my.isRow( my.id );
      
      if ( row != null ){
        
        my.user = my.member.username;
        
        my.column = COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue();
        
        my.writeMember();
        
        while( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue() != "" ) { 
          
          var change = tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER + 1 ).getValue() != "" ? tech.getRange( 3 + i , COLUMN_NUMBER + 1 ).getValue() : false;
          
          my.user = my.member.fullName === tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue() ? change ? change : my.member.fullName : my.member.fullName;
          
          i++;
          
        }
        
        my.column = COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue();
        
        my.writeMember();
        
        var due = workflow.getRange( my.row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue();
        
        switch ( my.delete ){
            
          case "true":
            
            due = new Date( due );
            
            break;
            
          case "false":
            
            due = due === "" ? "?" : due !="" && due != "?" ? new Date( due ) : "?";
        
            due === "?" ? workflow.getRange( my.row , 6 + tech.getRange( 1 , 1 ).getValue() ).setValue( "?" ) : null;
            
            break;
            
        }

        var year = new Date().getFullYear();
        
        my.data = { row: my.row, due: due, year: year, name: my.name, del: my.delete, user: my.user };
        
        my.parent.DopTable = my.data;
        
        var numcards = (obj) => { 
          
          return obj.getColumn() === 3 + tech.getRange( 1 , 1 ).getValue() && workflow.getRow( obj.getRow() , 9 + tech.getRange( 1 , 1 ).getValue() ).getValue() === "" ; 
          //if not moved to trekked lists
          
        };
        
        workflow.getRow( ROW_NUMBER + my.fullNames.indexOf( my.user ) , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).setValue( workflow.createTextFinder( my.user ).findAll().filter( numcards ).length );
        //write the number of cards with my member
        
        history.appendParagraph( "change member: " + my.user +", delete: " + my.delete );
        
      }
      
    } catch (er) {

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
    
      this.parent.error  = { message: er.toString() , log: "reMember : ", url: url + ": " };
    
    }
  
  }
  
  writeMember(){
  
    try{

      var my = this;
      
      my.newusers = workflow.getRange( my.row , my.column ).getValue();
      
      switch ( my.delete ){
          
        case "true":
          
          my.newusers.indexOf( ", " ) != -1 && my.newusers.indexOf( my.user ) != -1 ? my.newusers.indexOf( ", " ) != -1 < my.newusers.indexOf( my.user ) != -1 ? workflow.getRange( my.row , my.column ).setValue( my.newusers.replace( ", " + my.user , "") ) : workflow.getRange( my.row , my.column ).setValue( my.newusers.replace( my.user , "" ) ) : null;
          
          break;
          
        case "false":
          
          my.newusers != "" ? workflow.getRange( my.row , my.column ).setValue( my.newusers + ", " + my.user ) : workflow.getRange( my.row , my.column ).setValue( my.user );
          
          break;
          
      }
      
    } catch (er) {

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
    
      this.parent.error  = { message: er.toString() , log: "writeMember : ", url: url + ": "  };
    
    }
    
  }
  
}

class DopTable {

  constructor( data , parent ) {
    
    this.data = data;
    
    this.row = data.row;
            
    this.due = data.due;
    
    this.year = data.year;
    
    this.name = data.name;
            
    this.del = data.del;
    
    this.user = data.user;
    
    this.parent = parent;
    
    this.subrow = null;
    
    this.subcolumn = null;
    
    this.column = null;
    
    this.index = null;
    
    this.count = null;
    
    this.searched = null;
    
    this.thatdue = null;
    
  }
  
  push() {
    
    try{

      var my = this;
      
      var fullNames = [];
      
      while( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue() != "" ) { 
        
        var change = tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER + 1 ).getValue() != "" ? tech.getRange( 3 + i , 6 ).getValue() : false;
        
        var fullname = change ? change : tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue();
        
        fullNames.push( fullname );
        
        i++;
        
      }
      
      if ( fullNames.indexOf( my.user ) != -1 ){
        
        my.subrow = ROW_NUMBER + fullNames.indexOf( my.user ); 
        
        my.subcolumn = COLUMN_NUMBER;
        
        my.index = COLUMN_NUMBER; 
        
        my.count = 0;
        
        my.column = COLUMN_NUMBER;
        
        my.searched = my.is();
        
        while( my.subcolumn < 18 && dop.getRange( my.subrow , my.subcolumn ).getValue() != "" ){
          
          var spliced = dop.getRange( my.subrow , my.subcolumn ).getValue();
          
          spliced = spliced.indexOf( "   -   " ) != -1 ? spliced.split( "   -   " ) : null;
          
          if ( spliced != null ) {
            
            var filtering = (obj) => {
              
              var subdue = workflow.getRange( obj.getRow() , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue().toString();
              
              subdue = subdue.indexOf("T") != -1 ? subdue.split("T")[0].split("-")[2] + "." + subdue.split("T")[0].split("-")[1] : subdue.split(" ")[0].replace( "." + my.year , "" );
              
              return subdue === spliced[0];
              
            };
            
            my.thatdue = workflow.createTextFinder( spliced[1] ).findAll().filter( filtering )[0].getRow();
            
            my.thatdue = workflow.getRange( my.thatdue , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue();
            
            my.thatdue = new Date( my.thatdue );
            
            my.due != "?" ? my.thatdue < my.due ? my.index += 1 : null : null;
            
          }
          
          my.count += 1;
          
          my.subcolumn += 1;
          
        }
        
        switch( true ){
            
          case ( ! my.del && my.due != "?" ):
            
            history.appendParagraph( my.due );
            
            var swap = my.parent.link( workflow.getRange( my.row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue() + '";"' + my.due.split(" ")[0].replace("." + my.year , "") + "   -   " + my.name ); //namec
            
            var swaped;
            
            switch( true ){
                
              case ( ! my.searched ):
                
                history.appendParagraph( my.index + ":" + my.count + ":" + my.name ); //namec
                
                for ( var i = my.index ; i < COLUMN_NUMBER ; i++ ){
                  
                  swaped = dop.getRange( my.subrow , i ).getValue();
                  
                  dop.getRange( my.subrow , i ).setValue( swap );
                  
                  swap = swaped;
                  
                }
                
                break;
                
              case ( my.searched && my.searched >= my.index ):
                
                history.appendParagraph( my.index + ":" + my.count + ":" + my.name + ":" + my.searched );
                
                for ( var i = my.index ; i < COLUMN_NUMBER && i <= my.searched ; i++ ){ 
                  
                  swaped = dop.getRange( my.subrow , i ).getValue();
                  
                  dop.getRange( my.subrow , i ).setValue( swap );
                  
                  swap = swaped;
                  
                }
                
                break;
                
              case ( my.searched && my.searched < index ):
                
                history.appendParagraph( my.index + ":" + my.count + ":" + my.name + ":" + my.searched );
                
                var dopswap = dop.getRange( my.subrow , my.indexs + 1 ).getValue();
                
                for ( var i = my.searched ; i < COLUMN_NUMBER && i < my.index ; i++ ){
                  
                  swaped = dop.getRange( my.subrow , i + 2 ).getValue();
                  
                  dop.getRange( my.subrow , i ).setValue( dopswap );
                  
                  dopswap = swaped;
                  
                }
                
                dop.getRange( my.subrow , my.index ).setValue( swap );
                
                break;
                
            }
            
            break;
            
          case ( ! my.del && my.due === "?" && my.count < 10 ):
            
            history.appendParagraph( my.count + ":" + my.name );
            
            dop.getRange( my.subrow , 7 + my.count ).setValue( swap );
            
            break;
            
          case ( my.del && my.searched ):
            
            history.appendParagraph( my.index + ":" + my.count + ":" + my.name + ":" + my.searched );
            
            var swap = dop.getRange( my.subrow , my.searched + 1 ).getValue();
            
            var swaped;
            
            for ( var i = my.searched ; i < COLUMN_NUMBER ; i++ ){ 
              
              swaped = dop.getRange( my.subrow , i + 2 ).getValue();
              
              dop.getRange( my.subrow , i ).setValue( swap );
              
              swap = swaped;
              
            }
            
            break;
            
        }
        
      }
      
    } catch (er){

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
      
      this.parent.error  = { message: er.toString() , log: "isindop : ", url: url + ": " };
      
    }
  
  }
  
  is() {
    
    try{

      var my = this;
      
      if ( workflow.getRange( my.row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue() != "" ){
        
        var subbdue = workflow.getRange( my.row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue().toString();
        
        if ( subbdue != "?" ) {
          
          my.year = new Date().getFullYear();
          
          subbdue = subbdue.indexOf("T") != -1 ? subbdue.split( "T" )[0].split( "-" )[2] + "." + subbdue.split( "T" )[0].split( "-" )[1] : subbdue.split( " " )[0].replace( "." + my.year, "" );
          
        }
        
        var indop = dop.createTextFinder( my.parent.link( workflow.getRange( my.row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue() + '";"' + subbdue + "   -   " + my.name ) ).findAll();
        
        var subfiltering = (obj) => {
          
          return obj.getRow() === my.subrow;
          
        }
        
        indop = indop.length != 0 && my.subrow != null ? indop.filter( subfiltering ).length != 0 ? indop.filter( subfiltering )[0] : null : indop.length != 0 && my.subrow === null ? indop[0] : null;
        
        switch(true){
            
          case ( indop != null && my.searched === null):
            
            dop.getRange( indop.getRow() , indop.getColumn() ).setValue( my.parent.link( workflow.getRange( my.row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue() + '";"' + subbdue + "   -   " + my.name ) );
            
            break;
            
          case ( indop != null && my.searched != null ):
            
            my.searched = indop.getColumn();
            
            return my.searched;
            
            break;
            
          case ( indop === null && my.searched != null ):
            
            return false;
            
            break;
            
        }
        
      }
      
    } catch (er){

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
      
      this.parent.error  = { message: er.toString() , log: "isindop : ", url: url + ": "  };
      
    }
    
  }

}

class Telegram {

  constructor(  ){
    
    this.token = 'TELEGRAM_BOT_TOKEN';
    
    this.url = 'https://api.telegram.org/bot' + this.token + "/sendMessage";
    
    this.payload = null;
    
    this.params = null;
    
    this.response = null;
    
    this.me = "CHAT_ID";
  
  }
  
  set sendMessage( message ){
    
    try{
      
      var my = this;
      
      my.payload = JSON.stringify( { chat_id: my.me , text: message } );
      
      my.params = {
        
        'method' : 'post',
        
        'contentType': 'application/json',
        
        'payload': my.payload 
        
      };
      
      my.response = UrlFetchApp.fetch( my.url , my.params );
      
    } catch(err){
    
      history.appendParagraph("empty telegram message?: " + err.toString() );
    
    }

  }
  
}

class React {
  
  constructor( json ) {
    
    this.action = "action" in json ? json["action"] : null;
    
    this.members = "members" in json ? json["members"] : null;
    
    this.error = { message : null , log : null };
    
    this.data = null;
    
  }
  
  Name(){

    var my = this;
    
    return new Name( my.action , my );
    
  }
  
  Item(){

    var my = this;
    
    return new Item( my.action , my );
    
  }
  
  List(){

    var my = this;
    
    return new List( my.action , my );
    
  }
  
  Due(){

    var my = this;
    
    return new Due( my.action , my );
    
  }
  
  Member(){

    var my = this;
    
    return new Member( my.members , my.action , my );
    
  }
  
  set DopTable( data ){

    var my = this;

    var dopt = new DopTable( data , my );
    
    return dopt.push();
    
  }
  
  set error( error ) {
    
    doc.appendParagraph( "\n" + error.message );
    
    var message = ( "#LegalItGGroup, #" + error.log + "\n" + error.url + "\n" + error.message ).toString();
    
    history.appendParagraph( error.log + error.message );
    
    var teleg = new Telegram();
    
    teleg.sendMessage = message;
    
  }
  
  link( string ) {
    
    return '=hyperlink("' + string + '")';
    
  }
  
  isRow( id ){
    
    try{

      var my = this;
      
      my.row = workflow.createTextFinder( id ).findAll();
      //createTextFinder - method of the table class that return array of all cells that there 
      //are that value substring in their values strings
      
      return my.row = my.row.length != 0 ? my.row[0].getRow() : null;
      //we have to get row in the table where is card that was updated
      
    } catch (er) {

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
      
      this.error = { message: er.toString() , log: "isRow : ", url: url + ": " };
      
    }
    
  }
  
  set setItem( data ){

    var my = this;

    var itemer = new Item( my.action , my );
    
    return itemer.setItem = data;
    
  }
  
  set docer( data ) {
    
    try{

      var my = this;
      
      if ( data.p2 === "" ) {  
        
        doc.clear();
        
        doc.appendHorizontalRule();
        
        doc.appendParagraph( "TABLE ..: " + my.action.type + ":\n" ).setHeading( DocumentApp.ParagraphHeading.TITLE );
        
        history.appendHorizontalRule();
        
        history.appendParagraph( "TABLE ..: " + my.action.type + ":\n" ).setHeading( DocumentApp.ParagraphHeading.TITLE );
        
        data.p2=" : ";  
        
      }
      
      if ( typeof( data.obj ) === "object" && data.obj != null && data.obj != undefined ){
        
        doc.appendParagraph( "\n" + data.p1 + data.key + data.p2 + Object.keys( data.obj ).toString() + "\n" ).setHeading( DocumentApp.ParagraphHeading.HEADING1 );
        
        data.p1+="      ";
        
        for ( var key in data.obj ){
          
          my.docer = { obj: data.obj[key], key: key, p1: data.p1, p2: data.p2 };
          
        }
        
      } else {
        
        doc.appendParagraph( data.p1 + data.key + data.p2 + data.obj );
        
      }
      
    } catch (er){

      var url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null;
      
      this.error = { message: er.toString() , log: "docer : ", url: url + ": " };
      
    }
    
  }
  
}

function doPost(e) {
  
  var content = e.postData.contents;
  
  var json = JSON.parse( content ); 
  
  try{
    
    var init = new React( json );
    
    init.docer = { obj: json["action"], key: "", p1: "", p2: "" };
    
    //function in the bottom of the code after doGet(e) that prints all keys and their values to the log document
    //becouse "console" - logger - has not acces to web apps

  } catch (er){

    doc.appendParagraph( "new error:" );
    
    doc.appendParagraph( er.toString() );
    
    history.appendParagraph( "deobjecter err: " + er.toString() );
    //appendParagraph - print text to the document node(in my case - body)
    //print info to the documents

    doc.appendHorizontalRule();
    //and print horizontal line in the document

  }
  
  var actions = json[ "action" ]; 
  //data about all actions on the board
  
  try{
    
    switch( actions.type ){
        
      case "createCard": 
        
        var namer = init.Name();

        namer.createCard();
        
        break;
        
      case "updateCustomFieldItem": //item
        
        var itemer = init.Item();

        itemer.getItem();   
        
        break;
        
      case "updateCard":
        
        switch( true ){
            
          case ( "due" in actions.data.card ? actions.data.card.due != null ? true : false : false ):
            //if there are a deadline time of the card
            
            var duer = init.Due();

            duer.set();
            
            break;
            
          case ( "listBefore" in actions.data ):
            
            var lister = init.List();

            lister.change();
            
            break;
            
          case ("old" in actions.data ? "name" in actions.data.old : false):
            //if name of the card been changed
            
            var namer = init.Name();

            namer.rename();
            
            break;
            
        }
        
        break;
        
      case "updateList":
        
        if ( "old" in actions.data ? "name" in actions.data.old : false ) {
        
          var lister = init.List();

          lister.rename();
        
        }
        
        break;
        
      case ( "addMemberToCard" || "removeMemberFromCard"):
        
        var memberer = init.Member();

        memberer.reMember();
        
        break;
        
      default:
        
        doc.appendParagraph( "actions.type not found" );
        
        doc.appendHorizontalRule();
        
        break;
        
    }
    
  } catch(er) {
    
    doc.appendParagraph( "new error:" );
    
    doc.appendParagraph( er.toString() );
    
    history.appendParagraph( "new error:" + er.toString() );
    
    doc.appendHorizontalRule();
    
  }
  
  return HtmlService.createHtmlOutput('hello');
  
}

function doGet(e){
  
  return HtmlService.createHtmlOutput('hello');
  
}


