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
    
    var data = {
      
      method: 'POST', 
      
      contentType: 'application/json',
      
      muteHttpExceptions: true
      
    }
    
    var response = UrlFetchApp.fetch( this.url + "?key=" + this.key + "&callbackURL=" + this.callbackURL + "&idModel=" + this.idm + "&description=" + this.desc + this.other, data );
    //UrlFetchApp - class of google apps script modules that can fetch urls with options
    //UrlFetchApp.fetch - method of this class
    
    if (response.getResponseCode() == 200) {
      
      Logger.log( JSON.parse( response.getContentText() ) );
      
      this.getAll();
      
    } else {
      
      Logger.log( 'response status is ' + response.getResponseCode() );
      
      Logger.log( 'response ct is ' + response.getContentText() );
      //console.logs
      
    }
  
  }
  
  set get( url ){
    
    var data = {
      
      method: 'GET', 
      
      headers: {
        
        'Accept': 'application/json'
        
      }
      
    }
    
    var response = UrlFetchApp.fetch( url + "?key=" + this.key , data );
    //UrlFetchApp - class of google apps script modules that can fetch urls with options
    //UrlFetchApp.fetch - method of this class
    
    Logger.log( response.getResponseCode() );
    //console.logs
    
    return JSON.parse( response.getContentText() );
  
  }
  
  set getModel( id ){
    
    this.get = this.url + id;
  
  }
  
  getAll(){
    
    var json = this.get = this.url;
    
    Logger.log(json);
    
    Logger.log(json.map( item => { item.id + ":" + item.desc } ) );
    
    return json.map( item => item.id );
    
  }
  
  set del( id ){
    
    var data = {
      
      method: 'DELETE', 
      
      headers: {
        
        'Accept': 'application/json'
        
      }
      
    }
    
    var subresponse = UrlFetchApp.fetch( this.url + id + "?key=" + this.key , data );
    
  }
  
  delAll() {
    
    var ids = this.getAll();
    
    ids.forEach( item => this.del = item );
    
  }
  
  set push ( data ) {
    
    var subdata = {
      
      "method": "PUT",
      
      "contentType": "application/json",
      
      "payload": JSON.stringify( data.data )
      
    };
    
    history.appendParagraph( JSON.stringify( subdata ) );
      
    var response = UrlFetchApp.fetch( data.url + this.key + "&token=" + this.token , subdata );
  
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
      
      this.trekedLists.push( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue() ); 
      
      i++;
    
    }
    
    this.listNames = this.listNames.concat( this.trekedList ); 
    
    this.id = "data" in this.action ? "card" in this.action.data ? this.action.data.card.id : null : null; 
    
    this.url = "data" in this.action ? "card" in this.action.data ? "https://trello.com/c/" + this.action.data.card.shortLink : null : null; 
    
    this.name = "data" in this.action ? "card" in this.action.data ? this.action.data.card.name : null : null;
    
    this.date = "date" in this.action ? this.action.date : null;
    
    this.parent = parent;
    
    this.data = null; 
    
    this.searchKey = null;
    
    this.searched = null;
    
  }
  
  createCard() {
    
    try{
      
      if( this.listNames.indexOf( this.list ) ){
        
        workflow.insertRowBefore( this.newRow );
        //insert row in the table with cards before 4th row
        
        for ( var i = 1 ; i <= COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ; i++ ) {
          
          workflow.getRange( this.newRow , i ).setBackground( 'white' );
          
        }
        //and set white color of cells in this row
        
        workflow.getRange( this.newRow , COLUMN_NUMBER ).setValue( this.parent.link = this.url + '";"' + this.name );
        //getRange - method of the table class that take cell in this table and have methods
        //setValue - print something to the cell
        //link - function in the bottom of the code after functions deobjecter and deletewebhooks that set
        //google table formula  - hyperlink with url and text
        
        workflow.getRange( this.newRow , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).setValue( this.url );
        
        workflow.getRange( this.newRow , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).setValue( this.id );
        
        var time = new Date( this.date );
        
        workflow.getRange( this.newRow , COLUMN_NUMBER ).setValue( time );
        
        var coloring = function (){
          
          for ( var i = 1; i <= COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ; i++ ){
            
            workflow.getRange( this.newRow , i ).setBackground( this.colors[ this.trekedLists.indexOf( this.list ) ] );
            
          }
          
        };
        
        this.trekedLists.indexOf( this.list ) ? coloring() : null;
        
        this.isKey();
        //isKey - method that automaticaly set custom field item values if in the name of the card searched some key words
        
        history.appendParagraph( "name: " + this.name + ", url: " + this.url + ", id: " + this.id + ", date: " + this.date + ", list: " + this.list );
        
      }
      
    } catch (er){
      
      this.parent.error = { message: er.toString() , log: "createCard: " };
      
    }
    
  }
  
  rename(){ 
  
    try{
      
      var row = this.parrent.isRow = this.id;
      
      if ( row != null ){
        
        var due = workflow.getRange( row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue();
                
        due = due === "" ? "" : due !="" && due != "?" ? new Date( due ) : "?";
        
        var members = workflow.getRange( row , COLUMN_NUMBER ).getValue();
        
        members = members.indexOf(", ") != -1 ? members.splice(", ") : [members];
       
        due = due === "" && members[0] != "" ? "?" : due;
        
        if ( due != "" ){
          
          var year = new Date().getFullYear();
       
          this.data = { row: row, due: due, year: year, name: this.name, del: false };
          
          this.members[0] != "" ? this.members.forEach( user =>  { this.data["user"] = user; this.parent.DopTable = this.data } ) : null;
          
        }
                
        workflow.getRange( this.row , COLUMN_NUMBER ).setValue( this.parent.link = this.url + '";"' + this.name );
        
      }
      
      history.appendParagraph( "rename: " + this.name );
      
    } catch (er) {
    
      this.parent.error = { message: er.toString() , log: "setItems: " };
    
    }
  
  }
  
  isKey(){
    
    try{
      
      this.searchKey = { table: keyword, name: this.name, type: "text", id: "", cardId: this.id };
      
      this.searchKey = { table: projwords, name: this.name, type: "idValue", id: "", cardId: this.id };
      
    } catch (er) {
      
      this.parent.error = { message: er.toString() , log: "isKey: " };
      
    }
  
  }
  
  set searchKey( search ){
    
    try{
      
      this.searched = search.table.createTextFinder( "" ).findAll().filter( obj => obj.getValue() != "" );
      
      this.searched = this.searched.filter( obj => search.name.includes( obj.getValue() ) ); //range
        
      this.searched = this.searched.length != 0 ? this.searched[0] : null;
      
      if ( this.searched != null ){
        
        this.searched = search.table.getRange( 1 , this.searched.getColumn() ).getValue();
        
        this.parent.setItem = { type: search.type, value: this.searched, id: search.id, cardId: search.cardId };
        
      }
      
    } catch (er) {
      
      this.parent.error = { message: er.toString() , log: "searchKey: " };
      
    }
    
  }
  
}

class Item {
  
  constructor( fields , action , parent ) {  
    
    this.fields = fields;
    
    this.action = action;
    
    this.fieldsColumnStart = COLUMN_NUMBER;
    
    this.id = "data" in this.action ? "card" in this.action.data ? this.action.data.card.id : null : null; 
    
    this.name = "data" in this.action ? "card" in this.action.data ? this.action.data.card.name : null : null;
    
    this.fieldType = "data" in this.action ? "customField" in this.action.data ? this.action.data.customField.type : null : null;
    
    this.fieldName = "data" in this.action ? "customField" in this.action.data ? this.action.data.customField.name : null : null;
    
    this.fieldId = "data" in this.action ? "customFieldItem" in this.action.data ? this.action.data.customFieldItem.idCustomField : null : null;
    
    this.fieldValue = "data" in this.action ? "customFieldItem" in this.action.data ? "value" in this.action.data.customFieldItem ? "text" in this.action.data.customFieldItem.value ? this.action.data.customFieldItem.value.text : "" : "idValue" in this.action.data.customFieldItem ? this.action.data.customFieldItem.idValue : "" : "" : "";
    
    this.fieldColumn = null;
    
    this.parent = parent;
    
    this.fieldCount = tech.getRange( 1 , 1 ).getValue();
    
    this.index = null;
    
    this.row = null;
    
  }
  
  getItem(){
    
    try{
      
      switch( this.action.fieldType ){
          
        case "text":
          
          this.customField();
          
          break;
          
        case "list":
          
          var customField = this.fields.filter( obj => obj.id === this.fieldId )[0];
          //becouse there are in the object of current variants of values of list field 
          
          this.fieldValue = "options" in customField ? customField.options.filter( obj => obj.id === this.fieldValue )[0].value.text : "";
          //and text of this searched values
          
          this.customField();
          
          break;
          
      }
      
    } catch (er) {
      
      this.parent.error = { message: er.toString() , log: "getItem: " };
      
    }
    
  }
  
  customField() {
    
    try{
      
      this.index = this.fields.map( (obj , index) => { var searched = obj.type === "text" && obj.name === this.fieldName ? index : null; return searched } )[0];
      
      if ( this.index > this.fieldCount ) {
        
        for ( var i = 0 ; i < this.fields.length - this.fieldCount ; i++ ){
          
          workflow.insertColumnAfter( this.fieldsColumnStart + this.fieldCount );
          
          workflow.getRange ( ROW_NUMBER , this.fieldsColumnStart + this.fieldCount + i ).setValue( fields[ this.fieldCount + i ].name )
          
        }
        
        tech.getRange( 1 , 1 ).setValue( this.fields.length );
        
        new Telegram( "new fields, count: " + this.fields.length - this.fieldCount ).sendMessage();
        
      }
      
      this.fieldColumn = this.fieldsColumnStart + this.index;
      
      this.row = this.parrent.isRow = this.id;
      
      this.row != null ? workflow.getRange( this.row , this.fieldColumn ).setValue( this.fieldValue ) : null;
      
      history.appendParagraph( "field type: " + this.action.fieldType + ", column: " + this.fieldColumn + ", value: " + this.fieldValue );
      
    } catch (er) {
      
      this.parent.error = { message: er.toString() , log: "customField: " };
      
    }
    
  }
  
  set setItem( data ){
    
    try{
      
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
      
      this.parent.error = { message: er.toString() , log: "setItems: " };
      
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
      
      this.trekedLists.push( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue() ); 
      
      i++;
    
    }
    
    this.listNames = this.listNames.concat( this.trekedList ); 
    
    this.listAfter = "data" in this.action ? "listBefore" in this.action.data ? this.action.data.listAfter : null : null;
    
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
      
      if ( this.trekedLists.indexOf( this.listAfter ) ) {
        
        this.date = new Date();
        
        var row = this.parrent.isRow = this.id;
        
        if ( row != null ){
          
          workflow.getRange( row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).setValue( this.date );
          
          for (var i = 1 ; i <= 3 + tech.getRange( 1 , 1 ).getValue() ; i++ ) {
            
            workflow.getRange( row , i ).setBackground( this.colors[ this.trekedLists.indexOf( this.listAfter ) ] );
            
          }
          
          var members = workflow.getRange( row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue();
          
          members = members.indexOf(", ") != -1 ? members.split(", ") : [members];
          
          var due = workflow.getRange( row , COLUMN_NUMBER ).getValue();
          
          if ( due != "" && members[0] != "" ){
            
            this.year = new Date().getFullYear();
            
            this.data = { row: row, due: due, year: this.year, name: this.name, del: true };
            
            this.members.forEach( user => { this.data["user"] = user; this.parent.DopTable = this.data } );
            
          }
          
        }
      
      }
      
      history.appendParagraph( "list after: " + this.listAfter );
      
    } catch (er) {
    
      this.parent.error = { message: er.toString() , log: "change list: " };
    
    }
  
  }
  
  rename(){
    
    try{
      
      var old = this.action.data.old.name;
      
      var search = tech.createTextFinder( old ).findAll().filter( obj => obj.getValue() === old );
      
      if ( search.length != 0 ) {
      
        search.forEach( item => tech.getRange( item.getRow() , item.getColumn() ).setValue( this.list ) );
        
      }
      
    } catch (er) {
      
      this.parent.error = { message: er.toString() , log: "rename list: " };
      
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
      
      this.year = this.due.getFullYear();
      
      var row = this.isRow();
      
      if ( row != null ){
        
        workflow.getRange( row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).setValue( this.due );
        
        var members = workflow.getRange( row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue();
        //in this cell are member of this card
        
        members = members.indexOf(", ") != -1 ? members.splice(", ") : [members];
        //we look are there some members or just one
    
        this.data = { row: row, due: this.due, year: this.year, name: this.name, del: false };
                     
        members[0] != "" ? members.forEach( user => { this.data["user"] = user; this.parent.DopTable = this.data; } ) : null;
        //doppush - is function that maybe write to the dop table 
        //link to this card with text - deadline of this card or "?", defice and name
        //to the rows similar to the members of that board
        //and in that case - doesn't delete it
        
        history.appendParagraph( "due: " + this.due + ", members: " + members );
        
      }
      
    } catch (er) {
      
      this.parent.error = { message: er.toString() , log: "set due: " };
      
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
      
      this.row = this.isRow();
      
      if ( row != null ){
        
        this.user = this.member.username;
        
        this.column = COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue();
        
        this.writeMember();
        
        while( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue() != "" ) { 
          
          var change = tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER + 1 ).getValue() != "" ? tech.getRange( 3 + i , COLUMN_NUMBER + 1 ).getValue() : false;
          
          this.user = this.member.fullName === tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue() ? change ? change : this.member.fullName : this.member.fullName;
          
          i++;
          
        }
        
        this.column = COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue();
        
        this.writeMember();
        
        var due = workflow.getRange( this.row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue();
        
        switch ( this.delete ){
            
          case "true":
            
            due = new Date( due );
            
            break;
            
          case "false":
            
            due = due === "" ? "?" : due !="" && due != "?" ? new Date( due ) : "?";
        
            due === "?" ? workflow.getRange( this.row , 6 + tech.getRange( 1 , 1 ).getValue() ).setValue( "?" ) : null;
            
            break;
            
        }

        var year = new Date().getFullYear();
        
        this.data = { row: this.row, due: due, year: year, name: this.name, del: this.delete, user: this.user };
        
        this.parent.DopTable = this.data;
        
        var numcards = (obj) => { 
          
          return obj.getColumn() === 3 + tech.getRange( 1 , 1 ).getValue() && workflow.getRow( obj.getRow() , 9 + tech.getRange( 1 , 1 ).getValue() ).getValue() === "" ; 
          //if not moved to trekked lists
          
        };
        
        workflow.getRow( ROW_NUMBER + this.fullNames.indexOf( this.user ) , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).setValue( workflow.createTextFinder( this.user ).findAll().filter( numcards ).length );
        //write the number of cards with this member
        
        history.appendParagraph( "change member: " + this.user +", delete: " + this.delete );
        
      }
      
    } catch (er) {
    
      this.parent.error  = { message: er.toString() , log: "reMember: " };
    
    }
  
  }
  
  writeMember(){
  
    try{
      
      this.newusers = workflow.getRange( this.row , this.column ).getValue();
      
      switch ( this.delete ){
          
        case "true":
          
          this.newusers.indexOf( ", " ) && this.newusers.indexOf( this.user ) ? this.newusers.indexOf( ", " ) < this.newusers.indexOf( this.user ) ? workflow.getRange( this.row , this.column ).setValue( this.newusers.replace( ", " + this.user , "") ) : workflow.getRange( this.row , this.column ).setValue( this.newusers.replace( this.user , "" ) ) : null;
          
          break;
          
        case "false":
          
          this.newusers != "" ? workflow.getRange( this.row , this.column ).setValue( this.newusers + ", " + this.user ) : workflow.getRange( this.row , this.column ).setValue( this.user );
          
          break;
          
      }
      
    } catch (er) {
    
      this.parent.error  = { message: er.toString() , log: "writeMember: " };
    
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
      
      var fullNames = [];
      
      while( tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue() != "" ) { 
        
        var change = tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER + 1 ).getValue() != "" ? tech.getRange( 3 + i , 6 ).getValue() : false;
        
        var fullname = change ? change : tech.getRange( ROW_NUMBER + i , COLUMN_NUMBER ).getValue();
        
        fullNames.push( fullname );
        
        i++;
        
      }
      
      if ( fullNames.indexOf( this.user ) != -1 ){
        
        this.subrow = ROW_NUMBER + fullNames.indexOf( this.user ); 
        
        this.subcolumn = COLUMN_NUMBER;
        
        this.index = COLUMN_NUMBER; 
        
        this.count = 0;
        
        this.column = COLUMN_NUMBER;
        
        this.searched = this.is();
        
        while( this.subcolumn < 18 && dop.getRange( this.subrow , this.subcolumn ).getValue() != "" ){
          
          var spliced = dop.getRange( this.subrow , this.subcolumn ).getValue();
          
          spliced = spliced.indexOf( "   -   " ) != -1 ? spliced.split( "   -   " ) : null;
          
          if ( spliced != null ) {
            
            var filtering = (obj) => {
              
              var subdue = workflow.getRange( obj.getRow() , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue().toString();
              
              subdue = subdue.indexOf("T") != -1 ? subdue.split("T")[0].split("-")[2] + "." + subdue.split("T")[0].split("-")[1] : subdue.split(" ")[0].replace( "." + this.year , "" );
              
              return subdue === spliced[0];
              
            };
            
            this.thatdue = workflow.createTextFinder( spliced[1] ).findAll().filter( filtering )[0].getRow();
            
            this.thatdue = workflow.getRange( this.thatdue , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue();
            
            this.thatdue = new Date( this.thatdue );
            
            this.due != "?" ? this.thatdue < this.due ? this.index += 1 : null : null;
            
          }
          
          this.count += 1;
          
          this.subcolumn += 1;
          
        }
        
        switch( true ){
            
          case ( ! this.del && this.due != "?" ):
            
            history.appendParagraph( this.due );
            
            var swap = this.parent.link = workflow.getRange( this.row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue() + '";"' + this.due.split(" ")[0].replace("." + this.year , "") + "   -   " + this.name; //namec
            
            var swaped;
            
            switch( true ){
                
              case ( ! this.searched ):
                
                history.appendParagraph( this.index + ":" + this.count + ":" + this.name ); //namec
                
                for ( var i = this.index ; i < COLUMN_NUMBER ; i++ ){
                  
                  swaped = dop.getRange( this.subrow , i ).getValue();
                  
                  dop.getRange( this.subrow , i ).setValue( swap );
                  
                  swap = swaped;
                  
                }
                
                break;
                
              case ( this.searched && this.searched >= this.index ):
                
                history.appendParagraph( this.index + ":" + this.count + ":" + this.name + ":" + this.searched );
                
                for ( var i = this.index ; i < COLUMN_NUMBER && i <= this.searched ; i++ ){ 
                  
                  swaped = dop.getRange( this.subrow , i ).getValue();
                  
                  dop.getRange( this.subrow , i ).setValue( swap );
                  
                  swap = swaped;
                  
                }
                
                break;
                
              case ( this.searched && this.searched < index ):
                
                history.appendParagraph( this.index + ":" + this.count + ":" + this.name + ":" + this.searched );
                
                var dopswap = dop.getRange( this.subrow , this.indexs + 1 ).getValue();
                
                for ( var i = this.searched ; i < COLUMN_NUMBER && i < this.index ; i++ ){
                  
                  swaped = dop.getRange( this.subrow , i + 2 ).getValue();
                  
                  dop.getRange( this.subrow , i ).setValue( dopswap );
                  
                  dopswap = swaped;
                  
                }
                
                dop.getRange( this.subrow , this.index ).setValue( swap );
                
                break;
                
            }
            
            break;
            
          case ( ! this.del && this.due === "?" && this.count < 10 ):
            
            history.appendParagraph( this.count + ":" + this.name );
            
            dop.getRange( this.subrow , 7 + this.count ).setValue( swap );
            
            break;
            
          case ( this.del && this.searched ):
            
            history.appendParagraph( this.index + ":" + this.count + ":" + this.name + ":" + this.searched );
            
            var swap = dop.getRange( this.subrow , this.searched + 1 ).getValue();
            
            var swaped;
            
            for ( var i = this.searched ; i < COLUMN_NUMBER ; i++ ){ 
              
              swaped = dop.getRange( this.subrow , i + 2 ).getValue();
              
              dop.getRange( this.subrow , i ).setValue( swap );
              
              swap = swaped;
              
            }
            
            break;
            
        }
        
      }
      
    } catch (er){
      
      this.parent.error  = { message: er.toString() , log: "isindop: " };
      
    }
  
  }
  
  is() {
    
    try{
      
      if ( workflow.getRange( this.row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue() != "" ){
        
        var subbdue = workflow.getRange( this.row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue().toString();
        
        if ( subbdue != "?" ) {
          
          this.year = new Date().getFullYear();
          
          subbdue = subbdue.indexOf("T") != -1 ? subbdue.split( "T" )[0].split( "-" )[2] + "." + subbdue.split( "T" )[0].split( "-" )[1] : subbdue.split( " " )[0].replace( "." + this.year, "" );
          
        }
        
        var indop = dop.createTextFinder( this.parent.link = workflow.getRange( this.row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue() + '";"' + subbdue + "   -   " + this.name ).findAll();
        
        var subfiltering = (obj) => {
          
          return obj.getRow() === this.subrow;
          
        }
        
        indop = indop.length != 0 && this.subrow != null ? indop.filter( subfiltering ).length != 0 ? indop.filter( subfiltering )[0] : null : indop.length != 0 && this.subrow === null ? indop[0] : null;
        
        switch(true){
            
          case ( indop != null && this.searched === null):
            
            dop.getRange( indop.getRow() , indop.getColumn() ).setValue( this.parent.link = workflow.getRange( this.row , COLUMN_NUMBER + tech.getRange( 1 , 1 ).getValue() ).getValue() + '";"' + subbdue + "   -   " + this.name );
            
            break;
            
          case ( indop != null && this.searched != null ):
            
            this.searched = indop.getColumn();
            
            return this.searched;
            
            break;
            
          case ( indop === null && this.searched != null ):
            
            return false;
            
            break;
            
        }
        
      }
      
    } catch (er){
      
      this.parent.error  = { message: er.toString() , log: "isindop: " };
      
    }
    
  }

}

class Telegram {

  constructor( message ){
    
    this.message = message;
    
    this.token = 'TELEGRAM_BOT_TOKEN';
    
    this.url = 'https://api.telegram.org/bot' + this.token + "/sendMessage";
    
    this.payload = null;
    
    this.params = null;
    
    this.response = null;
    
    this.me = "CHAT_ID";
  
  }
  
  sendMessage(){
    
    this.payload = JSON.stringify({
      
      chat_id: this.me,
      
      text: this.message
      
    });
    
    this.params = {
      
      'method' : 'post',
      
      'contentType': 'application/json',
      
      'payload': JSON.stringify( this.payload )
      
    }
    
    this.response = UrlFetchApp.fetch(this.url, this.params);
  
  }
  
}

class React {
  
  constructor( json ) {
    
    this.fields = "customFields" in json ? json["customFields"] : null;
    
    this.action = "action" in json ? json["action"] : null;
    
    this.members = "members" in json ? json["members"] : null;
    
    this.error = { message : null , log : null };
    
    this.data = null;
    
    this.obj = this.action;
    
    this.p1 = "";
    
    this.key = "";
    
    this.p2 = "";
    
  }
  
  Name(){
    
    return new Name( this.action , self );
    
  }
  
  Item(){
    
    return new Item( this.fields , this.action , self );
    
  }
  
  List(){
    
    return new List( this.action , self );
    
  }
  
  Due(){
    
    return new Due( this.action , self );
    
  }
  
  Member(){
    
    return new Member( this.members , this.action , self );
    
  }
  
  set DopTable( data ){
    
    return new DopTable( data , self ).push();
    
  }
  
  set error( error ) {
    
    doc.appendParagraph( error.message );
    
    history.appendParagraph( error.log + error.message );
    
    new Telegram( error.log + error.message ).sendMessage();
    
  }
  
  set link( string ) {
    
    this.string = string;
    
    return '=hyperlink("' + this.string + '")';
    
  }
  
  set isRow( id ){
    
    try{
      
      this.row = workflow.createTextFinder( id ).findAll();
      //createTextFinder - method of the table class that return array of all cells that there 
      //are that value substring in their values strings
      
      return this.row = this.row.length != 0 ? this.row[0].getRow() : null;
      //we have to get row in the table where is card that was updated
      
    } catch (er) {
      
      this.error = { message: er.toString() , log: "isRow: " };
      
    }
    
  }
  
  set setItem( data ){
    
    return new Item( this.fields , this.action , self ).setItem = data;
    
  }
  
  docer() {
    
    try{
      
      if ( this.p2 === "" ) {  
        
        doc.clear();
        
        doc.appendHorizontalRule();
        
        doc.appendParagraph( "TABLE ..: " + this.action.type + ":\n" ).setHeading( DocumentApp.ParagraphHeading.TITLE );
        
        history.appendHorizontalRule();
        
        history.appendParagraph( "TABLE ..: " + this.action.type + ":\n" ).setHeading( DocumentApp.ParagraphHeading.TITLE );
        
        this.p2=" : ";  
        
      }
      
      if ( typeof( this.obj ) === "object" && this.obj != null && this.obj != undefined ){
        
        doc.appendParagraph( "\n" + this.p1 + this.key + p2 + Object.keys( this.obj ).toString() + "\n" ).setHeading( DocumentApp.ParagraphHeading.HEADING1 );
        
        this.p1+="      ";
        
        for ( var key in this.obj ){
          
          this.key = key;
          
          this.obj = this.obj[ key ];
          
          this.docer();
          
        }
        
      } else {
        
        doc.appendParagraph( this.p1 + this.key + this.p2 + this.obj );
        
      }
      
    } catch (er){
      
      this.error = { message: er.toString() , log: "docer: " };
      
    }
    
  }
  
}

function doPost(e) {
  
  var content = e.postData.contents;
  
  var json = JSON.parse( content ); 
  
  try{
    
    var init = new React( json );
    
    init.docer();
    
    //function in the bottom of the code after doGet(e) that prints all keys and their values to the log document
    //becouse "console" - logger - has not acces to web apps
  } catch (er){
    doc.appendParagraph( "new error:" );
    
    doc.appendParagraph( er.toString() );
    
    history.appendParagraph( "deobjecter err: " + er.toString() );
    //appendParagraph - print text to the document node(in this case - body)
    //print info to the documents
    doc.appendHorizontalRule();
    //and print horizontal line in the document
  }
  
  var actions = json[ "action" ]; 
  //data about all actions on the board
  
  try{
    
    switch( actions.type ){
        
      case "createCard": 
        
        init.Name().createCard();
        
        break;
        
      case "updateCustomFieldItem": //item
        
        init.Item().getItem();   
        
        break;
        
      case "updateCard":
        
        switch( true ){
            
          case ( "due" in actions.data.card ? actions.data.card.due != null ? true : false : false ):
            //if there are a deadline time of the card
            
            init.Due().set();
            
            break;
            
          case ( "listBefore" in actions.data ):
            
            init.List().change();
            
            break;
            
          case ("old" in actions.data ? "name" in actions.data.old : false):
            //if name of the card been changed
            
            init.Name().rename();
            
            break;
            
        }
        
        break;
        
      case "updateList":
        
        if ( "old" in actions.data ? "name" in actions.data.old : false ) {
        
          init.List().rename();
        
        }
        
        break;
        
      case ( "addMemberToCard" || "removeMemberFromCard"):
        
        init.Member().reMember();
        
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


