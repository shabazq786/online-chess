<b>Online chess game created with React/Redux</b>

<b>Features</b>:
  - two payer online chess game with game preferences
    - implemented all chess logics including en passant, pawn promotion, stalemate, checkmate
  - Draw/Resign button
  - Chat box for communication between players
  - Login/Register
  - Forums page/ Comment sectons
  - Game statistics for users

<b>To Do</b>:
  - enhance UI design/experience
  - add "vs Computer" option (stock engine)
  - cookie login authentication

<b>How to Run</b>:
  - open three terminals
  -run following command on each one:

    - cd frontend
        <br>
      npm start
   
    - cd server
      <br>
      node app
   
    - cd backend <br>
      source env/bin/activate <br>
      cd pyapi <br>
      python manage.py migrate <br>
      python manage.py makemigrations <br>
      python manage.py runserver

