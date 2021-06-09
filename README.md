# trello crm to the google tables 

there are

trello board, with cilumns(named lists) and cards
in every card can be: 
- deadline time and data of that card
- members
- name
- id
- labels
- description
- comments
- custom fields
- fiels
- and url

in this project model we looking for:
- creating all cards frome some columns(lists)
- renaming it
- date of creation
- memberships
- moving to some columns(lists) and date of this moovement
- and adding / changing custom field item

and created two boards:
- for every card of the project
- and for rows of members activity filtered by deadline

this code of (!) GOOGLE APPS SCRIPT (!) web application 
- set webhook to the board, that listen to every action on the board
- and when it is necessary - react to actions we need updating tables
