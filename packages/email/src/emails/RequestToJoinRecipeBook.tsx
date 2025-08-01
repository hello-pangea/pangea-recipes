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
  recipeBookName: string;
  requesterName: string;
  ownerName?: string;
  managerLink: string;
}

export function RequestToJoinRecipeBookEmail({
  recipeBookName = 'Amazing Recipes',
  managerLink = 'https://hellorecipes.com',
  ownerName = 'Wolfgang',
  requesterName = 'Gordon',
}: EmailProps): ReactNode {
  const previewText = `Share a recipe book? ${requesterName} is requesting access to ${recipeBookName}.`;

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
              Share a recipe book?
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello{ownerName ? ` ${ownerName}` : ''},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              {requesterName} is <strong>requesting access</strong> to "
              {recipeBookName}"
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white"
                href={managerLink}
              >
                Approve the request
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={managerLink} className="text-blue-600 no-underline">
                {managerLink}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default RequestToJoinRecipeBookEmail;
