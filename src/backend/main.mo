import Int "mo:core/Int";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  public type GameScore = {
    points : Nat;
    streak : Nat;
    perksEarned : [Text];
    scoreTimestamp : Time.Time;
    dailyScoreTimestamp : Time.Time;
  };

  module GameScore {
    public func compare(a : GameScore, b : GameScore) : Order.Order {
      Nat.compare(b.points, a.points);
    };

    public func compareByTime(a : GameScore, b : GameScore) : Order.Order {
      Nat.compare(
        Int.abs(Time.now() - b.scoreTimestamp),
        Int.abs(Time.now() - a.scoreTimestamp),
      );
    };
  };

  public type Progression = {
    currencyAmount : Nat;
    pointsHigh : Nat;
    dailyPointsHigh : Nat;
    streakLongest : Nat;
    perksOwned : List.List<Text>;
  };

  public type UserProfile = {
    name : Text;
    gamesPlayed : Nat;
  };

  let progressions = Map.empty<Principal, Progression>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let dailyGameScores = List.empty<GameScore>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func submitScore(points : Nat, streak : Nat, perksEarned : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit scores and save progression");
    };

    let gameScore = {
      points;
      streak;
      perksEarned;
      scoreTimestamp = Time.now();
      dailyScoreTimestamp = Time.now();
    };

    let dailyWindow = 86400000000000; //  24 hours
    let filteredScores = dailyGameScores.filter(
      func(s : GameScore) : Bool { Time.now() - s.dailyScoreTimestamp < dailyWindow }
    );

    dailyGameScores.clear();
    dailyGameScores.addAll(filteredScores.values());

    dailyGameScores.add(gameScore);

    let currentProgression = switch (progressions.get(caller)) {
      case (null) {
        {
          currencyAmount = 0;
          pointsHigh = 0;
          dailyPointsHigh = 0;
          streakLongest = 0;
          perksOwned = List.empty<Text>();
        };
      };
      case (?existing) { existing };
    };

    let updatedProgression = {
      currencyAmount = currentProgression.currencyAmount + 1;
      pointsHigh = Nat.max(points, currentProgression.pointsHigh);
      dailyPointsHigh = Nat.max(points, currentProgression.dailyPointsHigh);
      streakLongest = Nat.max(streak, currentProgression.streakLongest);
      perksOwned = currentProgression.perksOwned;
    };

    progressions.add(caller, updatedProgression);
  };

  public query ({ caller }) func getDailyLeaderboard() : async [GameScore] {
    let dailyWindow = 86400000000000; // 24 hours;
    let recentScores = dailyGameScores.filter(
      func(s : GameScore) : Bool { Time.now() - s.dailyScoreTimestamp < dailyWindow }
    );

    recentScores.toArray().sort();
  };

  public query ({ caller }) func getLeaderboard() : async [GameScore] {
    dailyGameScores.toArray().sort();
  };

  public shared ({ caller }) func unlockPerk(perk : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can unlock perks");
    };

    let currentProgression = switch (progressions.get(caller)) {
      case (null) {
        {
          currencyAmount = 0;
          pointsHigh = 0;
          dailyPointsHigh = 0;
          streakLongest = 0;
          perksOwned = List.empty<Text>();
        };
      };
      case (?progression) { progression };
    };

    if (currentProgression.currencyAmount == 0) {
      Runtime.trap("Unlock failed: Not enough coins earned");
    };

    currentProgression.perksOwned.add(perk);

    let updatedProgression = {
      currencyAmount = currentProgression.currencyAmount - 1;
      pointsHigh = currentProgression.pointsHigh;
      dailyPointsHigh = currentProgression.dailyPointsHigh;
      streakLongest = currentProgression.streakLongest;
      perksOwned = currentProgression.perksOwned;
    };

    progressions.add(caller, updatedProgression);
  };
};
