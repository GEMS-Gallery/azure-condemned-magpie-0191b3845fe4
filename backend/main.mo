import Bool "mo:base/Bool";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Result "mo:base/Result";
import Blob "mo:base/Blob";

actor {
  type File = {
    id: Nat;
    name: Text;
    fileType: Text;
    size: Nat;
    category: Text;
    content: Blob;
  };

  stable var nextId: Nat = 0;
  stable var files: [File] = [];

  public query func getFiles(): async [File] {
    Array.map(files, func (file: File): File {
      {
        id = file.id;
        name = file.name;
        fileType = file.fileType;
        size = file.size;
        category = file.category;
        content = Blob.fromArray([]);
      }
    })
  };

  public func addFile(name: Text, fileType: Text, size: Nat, category: Text, content: Blob): async Result.Result<Nat, Text> {
    let id = nextId;
    nextId += 1;
    let newFile: File = {
      id;
      name;
      fileType;
      size;
      category;
      content;
    };
    files := Array.append(files, [newFile]);
    #ok(id)
  };

  public query func getFilesByCategory(category: Text): async [File] {
    Array.filter(files, func (file: File): Bool {
      Text.equal(file.category, category)
    })
  };

  public query func getFileContent(id: Nat): async ?Blob {
    let file = Array.find(files, func (file: File): Bool { file.id == id });
    switch (file) {
      case (?f) ?f.content;
      case null null;
    }
  };
}
