class Book {
  constructor(title,author,link) {
    this.title = title;
    this.author = author;
    this.link = link
  }
}


class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");
    //create tr element
    const row = document.createElement("tr");
    //insert columns
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td><a target="_blank" href="${book.link}" class="open">${book.link}</a></td>
    <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
  }

  deleteBook(target) {
    if(target.className === "delete") {
    target.parentElement.parentElement.remove();
    }
  }  

  clearFields() {
    document.getElementById("book-form").reset();
  }

  showAlert(msg,className) {
    //create div
    const div = document.createElement("div");
    //add class
    div.className = `alert ${className}`;
    //add text
    div.appendChild(document.createTextNode(msg));
    //get parent
    const container = document.querySelector(".container");
    const form = document.getElementById("book-form");
    //insert alert
    container.insertBefore(div,form);
    //disappear alert after 3s
    setTimeout(function() {
     document.querySelector(".alert").remove()
    },3000)
  }
}


//local storage class
class Store {
  //fetch books from local storage
  static getBooks() {
    let books;
    if(localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  //display output from local storage
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function(book) {
      const ui = new UI;

      ui.addBookToList(book)
    })
  }

  //push books to local storage
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  //remove book from local storage
  static removeBook(link) {
    const books = Store.getBooks();
    books.forEach(function(book, index) {
      if(book.link === link) {
        books.splice(index,1)
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//DOM load event
document.addEventListener("DOMContentLoaded", Store.displayBooks);


//event listeners

//listen for submit
document.getElementById("book-form").addEventListener("submit", function(e) {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const link = document.getElementById("link").value;

  //instantiate book
  const book = new Book(title,author,link);
  

  //instantiate UI
  const ui = new UI();
  //validate
  if(title === "" || author === "" || link === "") {
    ui.showAlert("Please fill in all fields", "error");
  } else {
    
    //add book to list
    ui.addBookToList(book);

    //add to LS - don't have to instantiate it because it's static method
    Store.addBook(book);

    //show success
    ui.showAlert("Book added!", "success");

    //clear fields
    ui.clearFields();
  }

  e.preventDefault();
})


//listen for delete
document.getElementById("book-list").addEventListener("click", function(e) {

  //instantiate UI
  const ui = new UI();
  //delete book
  ui.deleteBook(e.target);
  
  //remove from lc
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})


























