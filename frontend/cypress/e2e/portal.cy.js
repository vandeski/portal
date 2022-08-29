// As an admin...

// ○ I can create a new question within a session and reorder and delete existing
// questions within a session
// ○ I can view a list of all sessions and view all questions within each session (I do
// not need to be able to actually answer them)
import axios from "axios";
import createValidation from "yup/lib/util/createValidation";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

const API = "http://localhost:3001";

describe("Portal Tests", () => {
  //Restore the database before each test
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: `${API}/restoreDb`,
      headers,
    });
    cy.visit("http://localhost:3000");
    cy.get("#session-card-1");
  });

  //As an admin...I can create a new session
  it("Creates a new Session", () => {
    cy.get("#add-session").click();
    cy.get("#session-name").type("Test Session");
    cy.get("#add-question").click();
    cy.get("#question-1").type("Test Question");
    cy.get("#submit-session").click();
    cy.contains("Session successfully created!");
  });

  //As an admin...I can delete a session
  it("Delete a Session", () => {
    cy.get("#edit-session-1").click();
    cy.get("#delete-session").click();
    cy.contains("Session successfully deleted!");
  });

  //As an admin...I can reorder sessions
  it("Reorder Sessions", () => {
    const dataTransfer = new DataTransfer();
    cy.get("#session-card-3").trigger("dragstart", {
      dataTransfer,
    });
    cy.get("#sessions-dashboard").trigger("drop", {
      dataTransfer,
    });
    // cy.get('#session-card-3').drag('#sessions-dashboard', {
    //     source: { x: 100, y: 100 }, // applies to the element being dragged
    //     target: { position: 'center' }, // applies to the drop target
    //     force: true, // applied to both the source and target element
    //   })
    // cy.get('#add-session')
    //   .trigger('mousedown', { which: 1 })
    //   .trigger('mousemove', { pageX: -100, pageY: 0 })
    //   .trigger('mouseup', { force: true })
    // cy.get('#session-card-3').move({ deltaX: -100, deltaY: 0, position: "center" });
    // cy.contains("Sessions order updated!");
  });

  //As an admin...I can update a session
  it("Update a Session", () => {
    cy.get("#edit-session-1").click();
    cy.get("#session-name").type("Session 1.1");
    cy.get("#submit-session").click();
    cy.contains("Session successfully updated!");
  });

  //As an admin...I can delete a question
  it("Delete a Question", () => {
    cy.get("#edit-session-3").click();
    cy.get("#delete-question-3").click();
    cy.get("#submit-session").click();
    cy.contains("Session successfully updated!");
  });

  //As an admin...I can create a question
  it("Create a Question", () => {
    cy.get("#edit-session-3").click();
    cy.get("#add-question").click();
    cy.get("#question-4").type("NEW QUESTION");
    cy.get("#submit-session").click();
    cy.contains("Session successfully updated!");
  });

  //As an admin...I can reorder questions
  it("Reorder Questions", () => {
    cy.get("#edit-session-3").click();
    const dataTransfer = new DataTransfer();
    cy.get("#question-drag-handle-1").trigger("dragstart", {
      dataTransfer,
    });
    cy.get("#question-container-3").trigger("drop", {
      dataTransfer,
    });
  });
});
