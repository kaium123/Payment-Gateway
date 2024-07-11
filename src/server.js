const { connectDB } = require('./database/postgres-database');
const { runMigrations } = require('./sql/run-migrations'); 

const app = require('./app/app');
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  try {
    res.status(200).json({ message: 'Connections are established' });
  } catch (err) {
    res.status(500).json({ message: 'Connections are not established' });
  }
});


runMigrations().then(() => {
  app.listen(port, async () => {
    try {
      await connectDB();
      console.log(`Server is listening on port ${port}`);
    } catch (err) {
      console.log('Server cannot be connected due to error:');
      console.log(err);
    }
  });
});
