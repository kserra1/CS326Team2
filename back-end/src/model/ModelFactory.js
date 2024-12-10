import SQLiteUserModel from "./SQLiteUserModel.js";
import SQLiteRecipeModel from "./SQLiteRecipeModel.js";
//Same model factory as class example:
//Essentially returns the model based on the string passed in
class _ModelFactory {
  async getModel(model = "sqlite") {
    if (model === "sqlite") {
      return SQLiteUserModel;
    } else if (model === "sqlite-fresh") {
      await SQLiteUserModel.init(true);
      return SQLiteUserModel;
    } else if (model === "recipe-model") {
      await SQLiteRecipeModel.init();
      return SQLiteRecipeModel;
    } else {
      return ;
    }
  }
}

const ModelFactory = new _ModelFactory();
export default ModelFactory;
