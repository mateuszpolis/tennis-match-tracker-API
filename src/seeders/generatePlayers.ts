import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { faker } from '@faker-js/faker';
import User, { UserRole, UserStatus } from '../models/User';

const generatePlayers = async () => {
  const password = 'Secure.Password1';
  const hashedPassword = await bcrypt.hash(password, 10);

  const players = [];
  
  for (let i = 0; i < 100; i++) {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const email = `${name.toLowerCase()}_${surname.toLowerCase()}@mail.com`;

    const confirmationToken = crypto.randomBytes(32).toString("hex");

    const player = {
      name,
      surname,
      email,
      password: hashedPassword,
      role: UserRole.User,
      status: UserStatus.Inactive,
      confirmationToken,
    };

    players.push(player);
  }

  try {
    await User.bulkCreate(players);


  } catch (err) {
    console.error("Error inserting players:", err);
  }
};

generatePlayers();
