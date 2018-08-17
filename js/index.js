 //DOM load event
window.addEventListener("DOMContentLoaded", function () {

    //Check that page is not running in a CodePen preview iframe
    if (!document.body.hasAttribute('translate')) {

        //Set speech recognition fallback
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        var recognition = new SpeechRecognition(),
        notes = document.querySelector('.notes-list'),
        saveBtn = document.querySelector('.btn-save'),
        createNote = function createNote(transcript) {var newNote = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            //Create list item element
            var note = document.createElement('li');

            //Add attributes to note
            note.textContent = transcript;
            note.classList.add('note');
            note.setAttribute('contenteditable', '');

            //Add note to notes list
            notes.appendChild(note);

            //Check save button class
            if (newNote && !saveBtn.classList.contains('unsaved')) saveBtn.classList.add('unsaved');
        },
        saveNotes = function saveNotes() {
            //Get notes
            var noteList = document.querySelectorAll('.note');

            if (noteList.length > 0) {
                //Store notes in local storage
                localStorage.setItem('notes', Array.from(noteList).map(function (note) {return note.textContent;}).join(', '));
            } else {
                //Delete notes entry from local storage
                if (localStorage.getItem('notes') !== null) localStorage.removeItem('notes');
            }

            //Check save button class
            if (saveBtn.classList.contains('unsaved')) saveBtn.classList.remove('unsaved');
        },
        loadNotes = function loadNotes() {
            //Check if notes exist in local storage
            if (localStorage.getItem('notes') !== null) {
                //Get notes from local storage
                var noteList = localStorage.getItem('notes').split(', ');

                //Display notes
                noteList.forEach(function (note) {return createNote(note, false);});
            }
        },
        checkNoteLength = function checkNoteLength(e) {
            //Check if note should be deleted
            if (e.target.textContent.length === 0) e.target.remove();

            //Check save button class
            if (!saveBtn.classList.contains('unsaved')) saveBtn.classList.add('unsaved');
        };

        notes.addEventListener('keyup', function (e) {return checkNoteLength(e);});

        saveBtn.addEventListener('click', function () {return saveNotes();});

        recognition.addEventListener('result', function (e) {return createNote(e.results[0][0].transcript);});

        recognition.addEventListener('end', recognition.start);

        recognition.start();

        loadNotes();
    }
});