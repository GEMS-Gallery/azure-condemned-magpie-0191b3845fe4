import Text "mo:base/Text";

actor {
  var storedValue: Text = "";

  public func setValue(value: Text): async () {
    storedValue := value;
  };

  public query func getValue(): async Text {
    storedValue
  };
}
