const FavoriteWordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  wordId: { type: mongoose.Schema.Types.ObjectId, ref: "Vocabulary" },
  addedAt: { type: Date, default: Date.now },
});
