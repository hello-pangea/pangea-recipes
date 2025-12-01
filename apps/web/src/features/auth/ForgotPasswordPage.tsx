import { RouterLink } from '#src/components/RouterLink';
import { useAppForm } from '#src/hooks/form';
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { authClient } from './authClient';

const formSchema = z.object({
  email: z.email(),
});

export function ForgotPasswordPage() {
  const sendEmail = useMutation({
    mutationFn: (
      data: Parameters<typeof authClient.requestPasswordReset>[0],
    ) => {
      return authClient.requestPasswordReset(data, {
        onError: (ctx) => {
          throw ctx.error;
        },
      });
    },
  });
  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const parsed = formSchema.parse(value);

      sendEmail.mutate({
        email: parsed.email,
        redirectTo: `${location.origin}/reset-password`,
      });
    },
  });

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        py: 2,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <img src="/assets/lil-guy.svg" width={22} height={22} />
        <Typography
          variant="h1"
          sx={{
            fontSize: 16,
            lineHeight: 1,
            ml: 1.5,
          }}
        >
          Pangea Recipes
        </Typography>
      </Box>
      <Card
        variant="outlined"
        sx={{
          p: 2,
          mb: 2,
          maxWidth: 400,
          width: '100%',
          border: 0,
          boxShadow:
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        }}
      >
        <Typography variant="h2" component={'h1'} sx={{ mb: 4 }}>
          {sendEmail.isSuccess ? 'Email sent' : 'Forgot password'}
        </Typography>
        {!sendEmail.isSuccess && (
          <Typography sx={{ mb: 2 }}>
            We will send you an email with instructions on how to reset your
            password.
          </Typography>
        )}
        {sendEmail.isSuccess ? (
          <>
            <Typography sx={{ mb: 2 }}>
              An email with instructions on how to reset your password has been
              sent to your email. Check your spam or junk folder if you don't
              see the email in your inbox.
            </Typography>
            <RouterLink to="/sign-in" variant="caption">
              Back
            </RouterLink>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <Stack direction={'column'} spacing={2} sx={{ maxWidth: '400px' }}>
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label="Email"
                    fullWidth
                    placeholder="name@example.com"
                    required
                    type="email"
                    autoComplete="email"
                  />
                )}
              />
              {sendEmail.isError && (
                <Alert severity="error">
                  {sendEmail.error.message || 'An error occurred'}
                </Alert>
              )}
              <Button
                variant="contained"
                type="submit"
                loading={sendEmail.isPending}
                fullWidth
              >
                Email me
              </Button>
              <RouterLink to="/sign-in" variant="caption">
                Back
              </RouterLink>
            </Stack>
          </form>
        )}
      </Card>
    </Container>
  );
}
