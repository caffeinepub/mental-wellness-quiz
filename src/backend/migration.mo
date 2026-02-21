import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type Question = {
    questionText : Text;
    options : [Text];
    correctAnswerIndex : Nat;
  };

  type UserProgress = {
    userId : Text;
    answers : [Nat];
  };

  type Attempt = {
    timestamp : Time.Time;
    answers : [Nat];
    score : Nat;
  };

  type OldActor = {
    questionsList : List.List<Question>;
    userAnswersList : List.List<UserProgress>;
  };

  type NewActor = {
    questionsList : List.List<Question>;
    userAttempts : Map.Map<Principal, List.List<Attempt>>;
  };

  public func run(old : OldActor) : NewActor {
    {
      userAttempts = Map.empty<Principal, List.List<Attempt>>();
      questionsList = old.questionsList;
    };
  };
};
