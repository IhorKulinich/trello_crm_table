//
//  GOOGLE APPS SCRIPT !!! BASED ON JS
//

const workflow = SpreadsheetApp.openById("TABLE ID").getSheetByName("LIST OF CARDS NAME"); 
const dop = SpreadsheetApp.openById("TABLE ID").getSheetByName("LIST OF STATISTIC NAME"); 
//open google table lists by id of the table and names of the lists

const doc = DocumentApp.openById("LOGGER_DOCUMENT_ID").getBody();
const history = DocumentApp.openById("HISTORY_DOCUMENT_ID").getBody();
//open google docs by ids and get acces to the class which contain texts and others

const key = 'YOUR_TRELLO_KEY';
const token = 'YOUR_TRELLO_TOKEN';
//getted from trello settings
const url = "https://api.trello.com/1/tokens/"+token+"/webhooks/";
const idm = "ID_OF_PARSING_MODEL";
//board id
const callbackURL = "GOOGLE_APPS_SCRIPT_WEB_APPLICATION_CALLBACK";
const other = "&customFieldItems=true&fields=all&actions=all&action_fields=all&actions_limit=1000&cards=all&card_fields=all&card_attachments=true&lists=all&list_fields=all&members=all&member_fields=all&checklists=all&checklist_fields=all&organization=false";
//options of available data in getting json
const whid = 'WEBHOOK_ID';
//get after running function setWebhook
const cardsurl = 'https://api.trello.com/1/cards/';

function setWebHook() {
  Logger.log(url + "?key=" + key + "&callbackURL=" + callbackURL + "&idModel=" + idm);
  //Logger - class of google apps script modules - analog of console
  //Logger.log() - method of this class with similar task - print something to the gas(google apps script) "console"
  
  let response = UrlFetchApp.fetch( url + "?key=" + key + "&callbackURL=" + callbackURL + "&idModel=" + idm + "&description=MY2" + other, {
                                   method: 'POST', 
                                   contentType: 'application/json',
                                   muteHttpExceptions: true
                                   });
  //UrlFetchApp - class of google apps script modules that can fetch urls with options
  //UrlFetchApp.fetch - method of this class
  
  if (response.getResponseCode() == 200) {
    let data = JSON.parse( response.getContentText() );
    
    Logger.log( data );
    //"console".log
    
    let subresponse = UrlFetchApp.fetch( url + "?key=" + key , {
                                        method: 'GET', 
                                        headers: {
                                        'Accept': 'application/json'
                                        }
                                        });
    //UrlFetchApp - class of google apps script modules that can fetch urls with options
    //UrlFetchApp.fetch - method of this class  
    
    var content = subresponse.getContentText();
    
    var json = JSON.parse( content ); 
    
    Logger.log( json.map ( item => { return item.id } ) );
    //"console" log
    //get the id of the setted webhook in "console" and write it to the const whid 
  } else {
    Logger.log( 'response status is ' + response.getResponseCode() );
    
    Logger.log( 'response ct is ' + response.getContentText() );
    //console.logs
  }
}

function getWebHook() {
  let response = UrlFetchApp.fetch( url + whid + "?key=" + key , {
                                   method: 'GET', 
                                   headers: {
                                   'Accept': 'application/json'
                                   }
                                   });
  //UrlFetchApp - class of google apps script modules that can fetch urls with options
  //UrlFetchApp.fetch - method of this class
  Logger.log( response.getResponseCode() );
  //console.logs
}

function doPost(e) {
  
  var content = e.postData.contents;
  
  var json = JSON.parse( content ); 
  
  try{
    deobjecter(json,"",doc,history,"","");
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
  var names = [ "lawyer 1 trello fullName" , "lawyer 2 trello fullName" , "..." ];
  //fullNames of the trello board members
  
  try{
    switch( actions.type ){
        
      case "createCard": 
        
        try{
          
          if( actions.data.list.name === "LIST 1" || actions.data.list.name === "TREKED LIST 1" || actions.data.list.name === "..." ){
            
            workflow.insertRowBefore( ROW_NUMBER );
            //insert row in the table with cards before 4th row
            for ( var i = 1 ; i <= COLUMN_NUMBER ; i++ ) {
              
              workflow.getRange( ROW_NUMBER , i ).setBackground( 'white' );
              
            }
            //and set white color of cells in this row
            workflow.getRange( ROW_NUMBER , COLUMN_NUMBER ).setValue( link( "https://trello.com/c/" + actions.data.card.shortLink , actions.data.card.name ) );
            //getRange - method of the table class that take cell in this table and have methods
            //setValue - print something to the cell
            //link - function in the bottom of the code after functions deobjecter and deletewebhooks that set
            //google table formula  - hyperlink with url and text
            workflow.getRange( ROW_NUMBER , COLUMN_NUMBER ).setValue( "https://trello.com/c/" + actions.data.card.shortLink );
            
            workflow.getRange( ROW_NUMBER , COLUMN_NUMBER ).setValue( actions.data.card.id );
            
            var time = new Date( actions.date );
            
            workflow.getRange( ROW_NUMBER , COLUMN_NUMBER ).setValue( time );
            
            switch (actions.data.list.name){
                
              case ("TREKED LIST 1"):
                
                for ( var i = 1; k <= COLUMN_NUMBER ; k++ ){
                  
                  workflow.getRange( ROW_NUMBER , i ).setBackground( '#fff2cc' );
                  
                }
                
                break;
                
              case ("TREKED LIST 2"):
                
                for ( var i = 1 ; i <= COLUMN_NUMBER ; i++ ){
                  
                  workflow.getRange( ROW_NUMBER , i ).setBackground( '#d9ead3' );
                  
                }
                
                break;
            }
            
            try{
              
              pushItems( actions.data.card.name , actions.data.card.id );
              //pushItems - function in the bottom of the code that automaticaly set custom field item values if in the name of the card searched some key words
              
            } catch(errr){
              
              doc.appendParagraph( errr.toString() );
              
              history.appendParagraph( "pushitem" + errr.toString() );
              
            }
            
            history.appendParagraph( "name: " + actions.data.card.name + ", url: " + actions.data.card.shortLink + ", id: " + actions.data.card.id + ", date: " + actions.date + ", list: " + actions.data.list.name );
            
          }
          
        } catch (err){
          
          doc.appendParagraph( err.toString() );
          
          history.appendParagraph( "new card err" + err.toString() );
          
        }
        
        break;
        
      case "updateCustomFieldItem": //item
        
        switch( actions.data.customField.type ){
            //custom field can be boolean,number,checkboxe,...,text and list types
            
          case "text":
            
            try{
              
              switch( actions.data.customField.name ){
                  
                case "TEXT FIELD 1":
                  
                  customFieldText( actions.data.card.id , COLUMN_NUMBER , actions.data.customFieldItem.value.text );
                  //function that write values of the field when them were update to the table
                  
                  break;
                  
                case "TEXT FIELD 1":
                  
                  customFieldText( actions.data.card.id , COLUMN_NUMBER , actions.data.customFieldItem.value.text );
                  
                  break;
                  
              }
              
              history.appendParagraph( "cf type: " + actions.data.customField.type + ", cf name: " + actions.data.customField.name + ", value: " + actions.data.customFieldItem.value.text );
              
            } catch(err) {
              
              doc.appendParagraph( err.toString() );
              
              history.appendParagraph( "cf text err: " + err.toString() );
              
            }
            
            break;
            
          case "list":
            
            try{
              
              var resl = UrlFetchApp.fetch( "https://api.trello.com/1/boards/" + idm + "/customFields?key=" + key + "&token=" + token , {
                                           method: 'GET' } );
              //action json doesn't contain information we need if field type is list and we have to parse information about all custom fields
              
              var contentl = resl.getContentText();
              
              var customfields = JSON.parse(contentl);  //static
              
              var customField = customfields.filter( obj => obj.id === actions.data.customFieldItem.idCustomField )[0];
              //becouse there are in the object of current variants of values of list field 
              
              var text = "options" in customField ? customField.options.filter( obj => obj.id === actions.data.customFieldItem.idValue )[0].value.text : "";
              //and text of this searched values
              
              switch(actions.data.customField.name){
                  
                case "LIST FIELD NAME":
                  
                  customFieldText( actions.data.card.id , COLUMN_NUMBER , text );
                  
                  break;
                  
              }
              
              history.appendParagraph( "cf name: " + actions.data.customField.name + ", value: " + text );
              
            } catch(err) {
              
              doc.appendParagraph( err.toString() );
              
              history.appendParagraph( "cf list err: " + err.toString() );
              
            }
            
            break;
            
        }    
        
        break;
        
      case "updateCard":
        
        switch( true ){
            
          case ( "due" in actions.data.card ? actions.data.card.due != null ? true : false : false ):
            //if there are a deadline time of the card
            
            try{
              
              var due = new Date(actions.data.card.due);
              
              var year = due.getFullYear();
              
              var row = workflow.createTextFinder( actions.data.card.id ).findAll();
              //createTextFinder - method of the table class that return array of all cells that there 
              //are that value substring in their values strings
              
              row = row.length != 0 ? row[0].getRow() : null;
              //we have to get row in the table where is card that was updated
              
              if ( row != null ){
                
                workflow.getRange( row , COLUMN_NUMBER ).setValue( due );
                
                var users = workflow.getRange( row , COLUMN_NUMBER ).getValue();
                //in this cell are member of this card
                
                users = users.indexOf(", ") != -1 ? users.splice(", ") : [users];
                //we look are there some members or just one
                
                for ( var i = 0 ; i < users.length && users[i] != "" ; i++ ){
                  
                  doppush( users[i] , row , due , year , actions.data.card.name , names , false );
                  //doppush - is function that maybe write to the dop table 
                  //link to this card with text - deadline of this card or "?", defice and name
                  //to the rows similar to the members of that board
                  //and in that case - doesn't delete it
                }
                
              }
              
              history.appendParagraph( "due: " + due + ", users: " + users );
              
            } catch (err) {
              
              doc.appendParagraph( err.toString() );
              
              history.appendParagraph( "due err: " + err.toString() );
              
            }
            
            break;
            
          case ( "listBefore" in actions.data ):  // swap
            
            try{
              
              switch( actions.data.listAfter.name ){
                  
                case ("TREKED LIST 1"):
                  
                  setNewList( actions.data.card.id , '#fff2cc' , actions.data.card.name );
                  
                  break;
                  
              }
              
              history.appendParagraph( "listAfter: " + actions.data.listAfter.name );
              
            } catch(err){
              
              doc.appendParagraph( err.toString() );
              
              history.appendParagraph( "listAfter err: " + err.toString() );
              
            }
            
            break;
            
          case ("old" in actions.data ? "name" in actions.data.old : false):
            //if name of the card been changed
            
            try{
              
              var row = workflow.createTextFinder( actions.data.card.id ).findAll();
              
              row = row.length!=0 ? row[0].getRow() : null;
              
              if ( row != null ) {
                
                var due = workflow.getRange( row , COLUMN_NUMBER ).getValue();
                
                due = due === "" ? "" : due !="" && due != "?" ? new Date(due) : "?";
                
                var users = workflow.getRange( row , COLUMN_NUMBER ).getValue();
                
                users = users.indexOf(", ") != -1 ? users.splice(", ") : [users];
                
                due = due === "" && users[0] != "" ? "?" : due;
                
                if (due != ""){
                  
                  var year = new Date().getFullYear();
                  
                  for (var I=0; I<users.length && users[I] != ""; I++){
                    
                    doppush( users[i] , row , due , year , actions.data.card.name , names , false );
                    
                  }
                  
                }
                
                workflow.getRange( row , COLUMN_NUMBER ).setValue( link( "https://trello.com/c/" + actions.data.card.shortLink , actions.data.card.name ) );
                
              }
              
              history.appendParagraph( "new name: " + actions.data.card.name );
              
            } catch (err){
              
              doc.appendParagraph( err.toString() );
              
              history.appendParagraph( "new name err: " + err.toString() );
              
            }
            
            break;
            
        }
        
        break;
        
      case "addMemberToCard":
        
        try{
          
          var username = actions.member.username;
          
          var user = actions.member.fullName === "ONE OF THE LAWYER" ? "ANOTHER NAME" : actions.member.fullName ;
          
          var row = workflow.createTextFinder( actions.data.card.id ).findAll();
          
          row = row.length != 0 ? row[0].getRow() : null;
          
          if ( row != null ){
            
            workflow.getRange( row , COLUMN_NUMBER ).getValue() != "" ? workflow.getRange( row , COLUMN_NUMBER ).setValue( workflow.getRange( row , COLUMN_NUMBER ).getValue() + ", " + user ) : workflow.getRange( row , COLUMN_NUMBER ).setValue( user ) ;
            
            workflow.getRange( row , COLUMN_NUMBER ).getValue() != "" ? workflow.getRange( row , COLUMN_NUMBER ).setValue( workflow.getRange( row , COLUMN_NUMBER ).getValue() + ", " + username ) : workflow.getRange( row , COLUMN_NUMBER ).setValue( username ) ;
            
            var due = workflow.getRange( row , COLUMN_NUMBER ).getValue();
            
            due = due === "" ? "?" : due !="" && due != "?" ? new Date(due) : "?";
            
            due === "?" ? workflow.getRange( row , COLUMN_NUMBER ).setValue( "?" ) : null;
            
            if (due != ""){
              
              var year = new Date().getFullYear();
              
              doppush( user , row , due , year , actions.data.card.name , names , false );
              
            }
            
            var numcards = (obj) => { return obj.getColumn() === COLUMN_NUMBER; };
            
            workflow.getRow( ROW_NUMBER + names.indexOf( user ) , COLUMN_NUMBER ).setValue( workflow.createTextFinder( user ).findAll().filter( numcards ).length);
            //write the number of cards with this member
          }
          
          history.appendParagraph( "new member: " + user );
          
        } catch (err){
          
          history.appendParagraph( "new member err: " + err.toString() );
          
        }
        
        break;
        
      case "removeMemberFromCard":
        
        try{
          
          var username = actions.member.username;
          
          var user = actions.member.fullName === "ONE OF THE LAWYER" ? "ANOTHER NAME" : actions.member.fullName ;
          
          var row = workflow.createTextFinder( actions.data.card.id ).findAll();
          
          row = row.length != 0 ? row[0].getRow() : null;
          
          if ( row != null ){
            
            deluser( row , COLUMN_NUMBER , user );
            //deluser - that function that change cell about members value
            deluser( row , COLUMN_NUMBER , username );
            
            var due = new Date( workflow.getRange( row , COLUMN_NUMBER ).getValue() );
            
            if (due != ""){
              
              var year = new Date().getFullYear();
              
              doppush( user , row , due , year , actions.data.card.name , names , true );
              //delete that card from member's row of dop table
            }
            
            var users = workflow.getRange( row , COLUMN_NUMBER ).getValue();
            
            users = users.indexOf(", ") != -1 ? users.split(", ") : [users];
            
            if ( users[0] === "" ){
              
              workflow.getRange( row , COLUMN_NUMBER ).setValue( "" );
              
            }
            
          }
          
          history.appendParagraph( "del member: " + user );
          
          var numcards = (obj) => { return obj.getColumn() === COLUMN_NUMBER; };
          
          workflow.getRow( ROW_NUMBER + names.indexOf( user ) , COLUMN_NUMBER ).setValue( workflow.createTextFinder( user ).findAll().filter( numcards ).length);
          
        } catch (err){
          
          doc.appendParagraph( err.toString() );
          
          history.appendParagraph( "del member err: " + err.toString() );
          
        }
        
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

function deobjecter( obj , keyf , doc , history , p1 , p2 ){
  
  if ( p2 === "" ) {  
    
    doc.clear();
    
    doc.appendHorizontalRule();
    
    doc.appendParagraph( "TABLE ..: " + obj.action.type + ":\n" ).setHeading( DocumentApp.ParagraphHeading.TITLE );
    
    history.appendHorizontalRule();
    
    history.appendParagraph( "TABLE ..: " + obj.action.type + ":\n" ).setHeading( DocumentApp.ParagraphHeading.TITLE );
    
    p2=" : ";  
    
  }
  
  if ( typeof( obj ) === "object" && obj != null && obj != undefined ){
    
    doc.appendParagraph( "\n" + p1 + keyf + p2 + Object.keys( obj ).toString() + "\n" ).setHeading( DocumentApp.ParagraphHeading.HEADING1 );
    
    p1+="      ";
    
    for ( var key in obj ){
      
      deobjecter( obj[ key ] , key , doc , history , p1 , p2 );
      
    }
    
  } else {
    
    doc.appendParagraph( p1 + keyf + p2 + obj );
    
  }
  
}

function deletewebhook() {
  
  let response = UrlFetchApp.fetch( url + "?key=" + key , {
                                   method: 'GET', 
                                   headers: {
                                   'Accept': 'application/json'
                                   }
                                   });
  
  var content = response.getContentText();
  
  var json = JSON.parse(content); 
  
  Logger.log(json);
  
  Logger.log(json.map(item => { return item.id}));
  
  for (var i=0; i<json.length; i++){
    
    let subresponse = UrlFetchApp.fetch( url + json[i].id + "?key=" + key , {
                                        method: 'DELETE', 
                                        headers: {
                                        'Accept': 'application/json'
                                        }
                                        });
    
  }
  
}

function link( url , text ){
  
  return '=hyperlink("' + url + '";"' + text + '")';
  
}

function customFieldText( id , column , text ){
  
  var row = workflow.createTextFinder( id ).findAll();
  
  row = row.length != 0 ? row[0].getRow() : null;
  
  row != null ? workflow.getRange( row , column ).setValue( text ) : null;
  
}

function setNewList( id , color , name ){
  
  var date = new Date();
  
  var row = workflow.createTextFinder( id ).findAll();
  
  row = row.length != 0 ? row[0].getRow() : null;
  
  
  
  if ( row != null ){
    
    workflow.getRange( row , COLUMN_NUMBER ).setValue( date ).setBackground( color );
    
    for (var i = 1 ; i <= COLUMN_NUMBER ; i++ ) {
      
      workflow.getRange( row , i ).setBackground( color );
      
    }
    
    var users = workflow.getRange( row , COLUMN_NUMBER ).getValue();
    
    users = users.indexOf(", ") != -1 ? users.split(", ") : [users];
    
    var due = workflow.getRange(row,11).getValue();
    
    if ( due != "" && users[0] != "" ){
      
      var year = new Date().getFullYear();
      
      for (var i=0; i<users.length; i++){
        
        doppush( users[i] , row , due , year , name , names , true );
        //when we move card frome one list to the treked list - we delete card information in the dop table
        
      }
      
    }
    
  }
}


function isindop( row , sub , indexs ) {
  
  try{
    
    if ( workflow.getRange( row , COLUMN_NUMBER ).getValue() != "" ){
      
      var name = workflow.getRange( row , COLUMN_NUMBER ).getValue();
      
      name = name.indexOf( "hyperlink" ) != -1 ? name.splice('"')[3] : name;
      
      var subbdue = workflow.getRange( row , COLUMN_NUMBER ).getValue().toString();
      
      if ( subbdue != "?" ) {
        
        var year = new Date().getFullYear();
        
        subbdue = subbdue.indexOf("T") != -1 ? subbdue.split( "T" )[0].split( "-" )[2] + "." + subbdue.split( "T" )[0].split( "-" )[1] : subbdue.split( " " )[0].replace( "." + year, "" );
        
      }
      
      var indop = dop.createTextFinder( link( workflow.getRange( row , COLUMN_NUMBER ).getValue() , subbdue + "   -   " + name ) ).findAll();
      
      var subfiltering = (obj) => {
        
        return obj.getRow() === sub;
        
      }
      
      indop = indop.length != 0 && sub !=null ? indop.filter( subfiltering ).length != 0 ? indop.filter( subfiltering )[0] : null : indop.length != 0 && sub ===null ? indop[0] : null;
      
      switch(true){
          
        case ( indop != null && indexs === null):
          
          dop.getRange( indop.getRow() , indop.getColumn() ).setValue( link( workflow.getRange( row , COLUMN_NUMBER ).getValue() , subbdue + "   -   " + actions.data.card.name ) );
          
          break;
          
        case ( indop != null && indexs != null ):
          
          indexs = indop.getColumn();
          
          return indexs;
          
          break;
          
        case ( indop === null && indexs != null ):
          
          return false;
          
          break;
          
      }
      
    }
    
  } catch (errr){
    
    doc.appendParagraph( errr.toString() );
    
    history.appendParagraph( "isindop err: " + errr.toString() );
    
  }
  
}

function doppush( user , row , due , year , namec , names , del ){
  
  try{
    
    if ( names.indexOf( user ) != -1 ){
      
      var subrow = ROW_NUMBER + names.indexOf( user ); 
      
      var subcolumn = COLUMN_NUMBER, index=COLUMN_NUMBER, count = 0;
      
      var indexs = isindop( row , subrow , COLUMN_NUMBER );
      
      if ( due != "?" ) {
        
        if ( !del ){
          
          while( subcolumn < COLUMN_COUNT && dop.getRange( subrow , subcolumn ).getValue() != "" ){
            
            var spliced = dop.getRange( subrow , subcolumn ).getValue();
            
            spliced = spliced.indexOf( "   -   " ) != -1 ? spliced.split( "   -   " ) : null;
            
            if ( spliced != null ) {
              
              var filtering = (obj) => {
                
                var subdue = workflow.getRange( obj.getRow() , COLUMN_NUMBER ).getValue().toString();
                
                subdue = subdue.indexOf("T") != -1 ? subdue.split("T")[0].split("-")[2] + "." + subdue.split("T")[0].split("-")[1] : subdue.split(" ")[0].replace( "." + year , "" );
                
                return subdue === spliced[0];
                
              };
              
              var thatdue = workflow.createTextFinder( spliced[1] ).findAll().filter( filtering )[0].getRow();
              
              thatdue = workflow.getRange( thatdue , COLUMN_NUMBER ).getValue();
              
              thatdue = new Date( thatdue );
              
              due != "?" ? thatdue < due ? index += 1 : null : null;
              
            }
            
            count += 1;
            
            subcolumn += 1;
            
          }
          
          history.appendParagraph( due );
          
          var swap = link( workflow.getRange( row , COLUMN_NUMBER ).getValue() , due.split(" ")[0].replace("." + year , "") + "   -   " + namec);
          
          var swaped;
          
          if ( ! indexs && due != "?" ){
            
            history.appendParagraph( index + ":" + count + ":" + namec );
            
            for ( var k = index ; k < COLUMN_NUMBER && k <= count + NUMBER ; k++ ){
              
              swaped = dop.getRange( subrow , k ).getValue();
              
              dop.getRange( subrow , k ).setValue( swap );
              
              swap = swaped;
              
            }
            
          } else if ( indexs && due != "?" ) {
            
            history.appendParagraph( index + ":" + count + ":" + namec + ":" + indexs );
            
            for ( var k = index ; k < COLUMN_NUMBER && k <= count + NUMBER && k <= indexs ; k++ ){
              
              swaped = dop.getRange( subrow , k ).getValue();
              
              dop.getRange( subrow , k ).setValue( swap );
              
              swap = swaped;
              
            }
            
          } else if ( indexs && due === "?" && count < NUMBER ){
            
            dop.getRange( subrow , UMBER - 1 + count ).setValue( swap );
            
          }
          
        } else if ( del && indexs && due != "?" ){
          
          history.appendParagraph( index + ":" + count + ":" + namec + ":" + indexs );
          
          var swap = dop.getRange( subrow , indexs + 1 ).getValue();
          
          var swaped;
          
          for ( var k = indexs ; k < COLUMN_NUMBER && k <= count + NUMBER ; k++ ){
            
            swaped = dop.getRange( subrow , k + 2 ).getValue();
            
            dop.getRange( subrow , k ).setValue( swap );
            
            swap = swaped;
            
          }
          
        }
        
      } else if ( del && due === "?" && count < 10 ) {
        
        history.appendParagraph( count + ":" + namec );
        
        dop.getRange( subrow , 7 + count ).setValue( swap );
        
      }
      
    }
    
  } catch(errr){
    
    doc.appendParagraph( errr.toString() );
    
    history.appendParagraph( "doppush err: " + errr.toString() );
    
  }
  
}

function deluser( row , column , userc ){
  
  try{
    
    var newusers = workflow.getRange( row , column ).getValue();
    
    let pos = -1, num = 0;
    
    while ( ( pos = newusers.indexOf( ", " , pos + 1) ) != -1 && num <= 2 && pos < newusers.indexOf( userc ) ) {
      
      num += 1;
      
    }
    
    newusers = num > 0 ? newusers.replace( ", " + userc , "") : newusers.replace( userc , "" ) ;
    
    workflow.getRange( row , column ).setValue( newusers );
    
  } catch(errr){
    
    doc.appendParagraph( errr.toString() );
    
    history.appendParagraph( "deluser err: " + errr.toString() );
    
  }
  
}

function pushItems( str , id ) {
  
  var keywords = [ [ "client 1" , "Client 1" , "CLIENT 1" ] ] ; 
  
  var cites = [ "www...com"];
  
  var projwords = [ [ "client 2" , "Client 2" , "CLIENT 2" ] ,  [ "client 3" , "Client 3" , "CLIENT 3" ]  ];
  
  var proj = [ "idValue1" , "idValue2" ];
  
  setItemfunc( keywords , cites , str , "text" , id );
  
  setItemfunc( projwords , proj , str , "idValue" , id );
  
}

function setItemfunc( keys , values , str , type , id ){
  
  if( keys.some( itemarray => itemarray.some( substring => str.includes( substring ) ) ) ){
    
    var key = keys.filter( itemarray=> itemarray.some( substring => str.includes( substring ) ) )[0];
    
    var value = values[ keys.indexOf( key ) ];
    
    history.appendParagraph( key + ":" + value );
    
    switch( type ){
        
      case "text":
        
        var subdata = {};
        
        subdata["value"] = {};
        
        subdata["value"]["text"] = value;
        
        pushItem(subdata,id,"idcustomfield1");
        
        break;
        
      case "idValue":
        
        var subdata = {};
        
        subdata["idValue"] = value;
        
        pushItem(subdata,id,"idcustomfield2");
        
        break;
        
    }
    
  }
  
}

function pushItem( subdata , id , fieldId ){
  
  var data = {
    "method": "PUT",
    "contentType": "application/json",
    "payload": JSON.stringify( subdata )
  };
  
  history.appendParagraph( JSON.stringify( data ) );
  
  let response = UrlFetchApp.fetch( cardsurl + id + "/customField/" + fieldId + "/item?key=" + key + "&token=" + token , data);
  
}

