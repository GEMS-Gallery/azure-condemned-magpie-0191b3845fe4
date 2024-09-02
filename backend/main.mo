import Bool "mo:base/Bool";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Result "mo:base/Result";

actor {
  type File = {
    id: Nat;
    name: Text;
    fileType: Text;
    size: ?Text;
    category: Text;
  };

  stable var nextId: Nat = 0;
  stable var files: [File] = [];

  public query func getFiles(): async [File] {
    files
  };

  public func addFile(name: Text, fileType: Text, size: ?Text, category: Text): async Result.Result<Nat, Text> {
    let id = nextId;
    nextId += 1;
    let newFile: File = {
      id;
      name;
      fileType;
      size;
      category;
    };
    files := Array.append(files, [newFile]);
    #ok(id)
  };

  public query func getFilesByCategory(category: Text): async [File] {
    Array.filter(files, func (file: File): Bool {
      Text.equal(file.category, category)
    })
  };
}
