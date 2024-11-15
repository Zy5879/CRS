import { Paper, TextInput, PasswordInput, Button, Title } from "@mantine/core";
import classes from "../LoginPage/LoginPage.module.css";

export function AdminLogin() {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Car Rental System
        </Title>
        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
        />
        <Button fullWidth mt="xl" size="md">
          Admin Login
        </Button>
      </Paper>
    </div>
  );
}
