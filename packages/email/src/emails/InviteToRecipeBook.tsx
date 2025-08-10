import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { type ReactNode } from 'react';

interface EmailProps {
  url: string;
  recipeBookName: string;
}

export function InviteToRecipeBook({
  url = 'https://pangearecipes.com',
  recipeBookName = 'Amazing Recipes',
}: EmailProps): ReactNode {
  const previewText = `Invite to recipe book "${recipeBookName}"`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#dadce0] rounded-lg my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={'https://assets.hellorecipes.com/assets/logo-128.png'}
                width="32"
                height="32"
                alt="Pangea Recipes"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join "{recipeBookName}"
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              You've been invited to join the recipe book "{recipeBookName}" on
              Pangea Recipes.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white"
                href={url}
              >
                Accept invitation
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={url} className="text-blue-600 no-underline">
                {url}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default InviteToRecipeBook;
