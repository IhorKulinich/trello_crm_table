# trello crm to the google tables 

i'm very sory for my capital of the great britan

there are

trello board, with columns(named lists) and cards.
in every card can be: 
- deadline time and data of that card
- members
- name
- id
- labels
- description
- comments
- custom fields
- files
- url
- and maybe other params

in this project model we looking for:
- creating all cards in some columns(lists)
- renaming it
- date of creation
- memberships
- moving to some columns(lists) and date of this moovement
- and adding / changing custom field item

and created two google tables:
- for every card of the project
- and for rows of members activity filtered by deadline

and use three google tables:
- with number of fields, interesting and treking lists names
- with keywords that can be in card name and field values

this code of (!) GOOGLE APPS SCRIPT (!) web application 
- set webhook to the board, that listen to every action on the board
- and when it is necessary - react to actions we need updating tables
- avtomaticaly set custom field item of some fields, if there are key words in the name of the card 
