import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import {
    Accordion,
    AccordionDetails,
    Typography,
    AccordionSummary,
    TextField,
    Pagination,
    Container,
    IconButton,
    Autocomplete
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    pagination: {
        display: 'flex',
        justifyContent: 'space-around',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    }
}));

function SearchAddress({ data }) {
    let searchTimeout = null;
    const classes = useStyles();
    const [entries, setEntries] = useState(data);
    const [page, setPage] = useState(1);
    const fuse = new Fuse(data, {
        threshold: 0.35,
        keys: ['full_address']
    });

    // searching client data. This function will handle mistyped searches as well
    const search = (text) => {
        // show results from the first page if you are on the furter page when you did the search
        setPage(1);

        // if search field is empty, return all
        if (!text) {
            setEntries(data);
            return;
        }

        let clients = data.filter(entry => {
            if(!entry.full_address) return false;

            try {
                const addressString = entry.full_address.toString();
                return addressString.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) >= 0;
            }
            catch(e){
                console.error(e);
                return false;
            }
        })

        // string match. no need to go further
        if(clients.length > 0) {
            setEntries(clients);
            return;
        }

        // using fuse package to perform searching
        clients = fuse.search(text);
        if(!clients) {
            setEntries([]);
            return;
        }
    
        clients = clients.map((p) => {
            return p.item;
        });
        setEntries(clients);
    };

    const perPage = 12;
    const chunks = [];
    // create pages
    for (let i = 0; i < entries.length; i += perPage) {
        const chunk = entries.slice(i, i + perPage);
        chunks.push(chunk);
    }

    // listing found entries
    const list = () => {
        if(!chunks[page - 1] || !chunks[page - 1]) {
            // maybe offer some options here
            return (
                <Typography>No results are found</Typography>
            );
        }

        return (
            chunks[page - 1].map((entry) => {
                // check if entry has at least one field available to show
                if(
                    !entry.amount &&
                    !entry.borrower_email &&
                    !entry.city &&
                    !entry.full_address
                ) return null;

                const title = entry.city || entry.full_address || entry.borrower_email || entry.amount;

                // maybe add some ways of handling other data points in case data structor changes 
                return (
                    <Accordion key={JSON.stringify(entry)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={'client-address-' + title}
                        >
                            <Typography>{title}</Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            {entry.amount && <Typography>{entry.amount}</Typography>}
                            {entry.borrower_email && <Typography>{entry.borrower_email}</Typography>}
                            {entry.city && <Typography>{entry.city}</Typography>}
                            {entry.full_address && <Typography>{entry.full_address}</Typography>}
                        </AccordionDetails>
                    </Accordion>
                );
            })
        );
    }

    return (
        <Container maxWidth='sm' className={classes.root}>
            <Autocomplete
                freeSolo
                disableClearable
                onChange={(e, value) => {
                    search(value);
                }}
                options={data.map((option) => option.full_address)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder='Address Search...'
                        onChange={(e) => {
                            // if case of fast typing, I am adding at least 300ms interval
                            // between searching to avoid extra calculation.
                            if(searchTimeout) clearTimeout(searchTimeout);

                            searchTimeout = setTimeout(() => {
                                search(e.target.value);
                            }, 300);
                        }}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <IconButton aria-label='search'>
                                    <SearchIcon />
                                </IconButton>
                            ),
                            type: 'search'
                        }}
                    />
                )}
            />

            <div style={{paddingTop: 30}}>
                {list()}
            </div>

            {chunks.length > 1 && (
                <Pagination
                    className={classes.pagination}
                    showFirstButton
                    showLastButton
                    size='small'
                    page={page}
                    count={chunks.length}
                    onChange={(e, value) => {
                        setPage(value);
                    }}
                />
            )}
        </Container>
    );
}

SearchAddress.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default SearchAddress;