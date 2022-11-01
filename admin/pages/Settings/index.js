import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { CheckPagePermissions, LoadingIndicatorPage } from '@strapi/helper-plugin';

import { Box } from '@strapi/design-system/Box';
import { Stack } from '@strapi/design-system/Stack';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { HeaderLayout, ContentLayout } from '@strapi/design-system/Layout';
import { Typography } from '@strapi/design-system/Typography';
import { TextInput } from '@strapi/design-system/TextInput';
import { ToggleInput } from '@strapi/design-system/ToggleInput';

import settingsApi from '../../api/settings';
import getTrad from '../../utils/getTrad';

const DocumentationLink = styled.a`
  color: ${({ theme }) => theme.colors.primary600};
`;

const Settings = () => {
  const { formatMessage } = useIntl();

  const [settings, setSettings] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    settingsApi.getSettings().then((res) => {
      setSettings(res.data);
      setIsLoading(false);
    });
  }, [setSettings]);

  return (
    <CheckPagePermissions
      permissions={[
        {
          action: 'plugin::shopify.settings.read',
          subject: null,
        },
      ]}
    >
      <HeaderLayout
        id="title"
        title="Shopify App Settings"
        subtitle="Manage the settings and behaviour of the Shopify plugin"
      />
      {isLoading ? (
        <LoadingIndicatorPage />
      ) : (
        <ContentLayout>
          <Box
            background="neutral0"
            hasRadius
            shadow="filterShadow"
            paddingTop={6}
            paddingBottom={6}
            paddingLeft={7}
            paddingRight={7}
          >
            <Stack spacing={4}>
              <Stack spacing={1}>
                <Typography variant="delta" as="h2">
                  Configuration
                </Typography>
                <Typography>
                  {formatMessage(
                    {
                      id: getTrad('settings.configuration'),
                      defaultMessage:
                        'The plugin is configured through the {file} file or through environment variables, checkout this {link} for the documentation.',
                    },
                    {
                      file: './config/plugins.js',
                      link: (
                        <DocumentationLink
                          href="https://github.com/shop3/strapi-plugin-shopify#readme"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          link
                        </DocumentationLink>
                      ),
                    }
                  )}
                </Typography>
              </Stack>
              <Grid gap={6}>
                <GridItem col={6} s={12}>
                  <TextInput
                    label="Host name"
                    name="host-name"
                    value={settings && settings.hostName}
                    onChange={() => {}}
                    disabled
                  />
                </GridItem>
                <GridItem col={6} s={12}>
                  <TextInput
                    label="Scopes"
                    name="api-scopes"
                    value={settings && settings.scopes.join(',')}
                    onChange={() => {}}
                    disabled
                  />
                </GridItem>
                <GridItem col={6} s={12}>
                  <TextInput
                    label="API key"
                    name="api-key"
                    value={settings && settings.apiKey}
                    onChange={() => {}}
                    disabled
                  />
                </GridItem>
                <GridItem col={6} s={12}>
                  <TextInput
                    label="API secret"
                    name="api-secret"
                    value={settings && settings.apiSecret}
                    onChange={() => {}}
                    disabled
                  />
                </GridItem>
                <GridItem col={6} s={12}>
                  <TextInput
                    label="Redirect url"
                    name="redirect-url"
                    value={settings && settings.redirectUrl}
                    onChange={() => {}}
                    disabled
                  />
                </GridItem>
                <GridItem col={6} s={12}>
                  <ToggleInput
                    label="Embedded"
                    name="is-embedded"
                    onLabel="True"
                    offLabel="False"
                    checked={settings && settings.isEmbedded}
                    onChange={() => {}}
                    disabled
                  />
                </GridItem>
              </Grid>
            </Stack>
          </Box>
        </ContentLayout>
      )}
    </CheckPagePermissions>
  );
};

export default Settings;
