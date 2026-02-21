import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Question = {
    questionText : Text;
    options : [Text];
    correctAnswerIndex : Nat;
  };

  type Quiz = {
    questions : [Question];
  };

  type Attempt = {
    timestamp : Time.Time;
    answers : [Nat];
    score : Nat;
  };

  let questionsList = List.empty<Question>();
  let userAttempts = Map.empty<Principal, List.List<Attempt>>();

  public shared ({ caller }) func addQuestion(
    questionText : Text,
    options : [Text],
    correctAnswerIndex : Nat,
  ) : async () {
    if (options.size() < 2) {
      Runtime.trap("A question must have at least two options.");
    };

    if (correctAnswerIndex >= options.size()) {
      Runtime.trap("Correct answer index is out of bounds.");
    };

    let newQuestion : Question = {
      questionText;
      options;
      correctAnswerIndex;
    };

    questionsList.add(newQuestion);
  };

  public query ({ caller }) func getAllQuestions() : async [Question] {
    questionsList.toArray();
  };

  public query ({ caller }) func getQuiz() : async ?Quiz {
    if (questionsList.isEmpty()) {
      return null;
    };

    ?{ questions = questionsList.toArray() };
  };

  public shared ({ caller }) func submitAnswers(answers : [Nat]) : async Nat {
    let score = calculateScore(answers);
    let timestamp = Time.now();

    let newAttempt : Attempt = {
      timestamp;
      answers;
      score;
    };

    let attempts = switch (userAttempts.get(caller)) {
      case (null) {
        let newList = List.empty<Attempt>();
        newList.add(newAttempt);
        newList;
      };
      case (?existing) {
        existing.add(newAttempt);
        existing;
      };
    };

    userAttempts.add(caller, attempts);
    score;
  };

  public query ({ caller }) func getUserAttempts(user : Principal) : async ?[Attempt] {
    switch (userAttempts.get(user)) {
      case (null) { null };
      case (?attempts) { ?attempts.toArray() };
    };
  };

  public query ({ caller }) func getMyAttempts() : async ?[Attempt] {
    switch (userAttempts.get(caller)) {
      case (null) { null };
      case (?attempts) { ?attempts.toArray() };
    };
  };

  public query ({ caller }) func getAllAttempts() : async [(Principal, [Attempt])] {
    userAttempts.toArray().map<((Principal, List.List<Attempt>)), (Principal, [Attempt])>(
      func((principal, attempts)) {
        (principal, attempts.toArray());
      }
    );
  };

  public query ({ caller }) func getLeaderboard() : async [(Principal, Nat)] {
    let allScores = userAttempts.toArray().map(
      func((principal, attempts)) {
        let totalScore = attempts.toArray().foldLeft(0, func(acc, attempt) { acc + attempt.score });
        (principal, totalScore);
      }
    );

    let sorted = allScores.sort(
      func(a, b) {
        Nat.compare(b.1, a.1);
      }
    );

    sorted;
  };

  func calculateScore(answers : [Nat]) : Nat {
    var score = 0;
    let questions = questionsList.toArray();

    for (i in Nat.range(0, answers.size())) {
      if (answers[i] == questions[i].correctAnswerIndex) {
        score += 1;
      };
    };
    score;
  };
};

