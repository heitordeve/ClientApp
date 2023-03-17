import React, { useEffect, useImperativeHandle } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import { MdLocationPin } from 'react-icons/md';

// instancia do autoCompleteService;
const autocompleteService = { current: null } as any;

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

export interface PlaceType {
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: [
      {
        offset: number;
        length: number;
      },
    ];
  };
}

const GoogleMapsAutoComplete = React.forwardRef(
  (
    {
      label,
      onSetValue,
      newValue,
      onFocus,
      onBlur,
    }: {
      label?: string;
      onSetValue?: any;
      newValue?: any;
      onFocus?: any;
      onBlur?: any;
    },
    ref,
  ) => {
    const classes = useStyles();
    const [value, setValue] = React.useState<PlaceType | null | string>(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<PlaceType[]>([]);

    useEffect(() => {
      setValue(newValue);
    }, [newValue]);

    useImperativeHandle(ref, () => ({
      setCurrentLocation() {
        setValue('Seu local');
      },
    }));

    const fetch = React.useMemo(
      () =>
        throttle((request: { input: string }, callback: (results?: PlaceType[]) => void) => {
          (autocompleteService.current as any).getPlacePredictions(request, callback);
        }, 200),
      [],
    );

    React.useEffect(() => {
      let active = true;

      if (!autocompleteService.current && (window as any).google) {
        autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
      }

      if (!autocompleteService.current) {
        return undefined;
      }

      if (inputValue === '') {
        setOptions(value ? [value as PlaceType] : []);
        return undefined;
      }

      fetch({ input: inputValue }, (results?: PlaceType[]) => {
        if (active) {
          let newOptions = [] as PlaceType[];

          if (value) {
            newOptions = [value as PlaceType];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      });

      return () => {
        active = false;
      };
    }, [value, inputValue, fetch]);

    return (
      <Autocomplete
        id="google-map-demo"
        getOptionLabel={(option: any) =>
          typeof option === 'string'
            ? option
            : option.description
            ? option.description
            : 'Seu local'
        }
        filterOptions={(x: any) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        onChange={(event: any, newValue: PlaceType | null) => {
          console.log('newValue', newValue);
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
          onSetValue(newValue);
        }}
        onInputChange={(event: any, newInputValue: React.SetStateAction<string>) => {
          setInputValue(newInputValue);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
          <TextField
            {...params}
            label={label || 'digite um endereço'}
            variant="outlined"
            size="small"
            style={{
              width: 270,
              backgroundColor: 'white',
            }}
          />
        )}
        renderOption={(option: {
          structured_formatting: {
            main_text_matched_substrings: any;
            main_text: any;
            secondary_text: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal;
          };
        }) => {
          const matches = option.structured_formatting.main_text_matched_substrings;
          const parts = parse(
            option.structured_formatting.main_text,
            matches.map((match: any) => [match.offset, match.offset + match.length]),
          );

          return (
            <Grid container alignItems="center">
              <Grid item>
                <MdLocationPin className={classes.icon} />
              </Grid>
              <Grid item xs>
                {parts.map(
                  (
                    part: {
                      highlight: any;
                      text: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal;
                    },
                    index: React.Key,
                  ) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                      {part.text}
                    </span>
                  ),
                )}
                <Typography variant="body2" color="textSecondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          );
        }}
      />
    );
  },
);

export default GoogleMapsAutoComplete;
