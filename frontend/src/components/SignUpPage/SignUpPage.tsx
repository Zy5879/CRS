import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
} from "@mantine/core";
import classes from "../LoginPage/LoginPage.module.css";

export function SignUpPage() {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Car Rental System
        </Title>
        <TextInput label="First Name" placeholder="Zach" size="md" />
        <TextInput label="Last Name" placeholder="Mac" size="md" />
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
        <TextInput label="Date of Birth" placeholder="2021-01-31" size="md" />
        <TextInput label="State" placeholder="Nevada" size="md" />
        <TextInput label="City" placeholder="Las Vegas" size="md" />
        <TextInput label="Drivers License" placeholder="NC122343" size="md" />
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="md">
          Sign Up
        </Button>
      </Paper>
    </div>
  );
}
