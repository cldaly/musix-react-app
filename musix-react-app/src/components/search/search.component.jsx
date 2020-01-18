import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import axios from 'axios';

import AlbumList from '../album-list/album-list.component';
import './search.styles.css';
import TrackList from '../track-list/track-list.component';

class Album {
    id;
    albumName;
    artist;
    imgUrl;
}

class Search extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoggedIn: this.props.isLoggedIn,
            searchType: 'artist',
            trackView:{
                on:false,
                status: 'hold'
            },
            searchField: '',
            searchStatus: 'hold',
            key: 'd02851a81c8e025c628c78519b0e0bd5',
            searchAlbums: [],
            trackList: [],
            album: {
                id: null,
                albumName: undefined,
                artist: undefined,
                imgUrl: undefined
            }
        }
    }
    

    changeType = (e) => {
        let type = e.target.value;
        if (type === undefined) {
            type = e.target.innerHTML.split(" ")[2];
        }
        return this.setState({searchType: type})
    }

    search = () => {
        if (this.state.searchField !== '') {
            this.setState({searchAlbums:[], searchStatus:'loading'});
            let albums = [];
            if (this.state.searchType === 'artist') {
                let url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${this.state.searchField}&api_key=${this.state.key}&format=json`;
                axios.get(url)
                .then(data => {
                    return JSON.parse(data.request.response);
                }).then((data)=>{
                    data.topalbums.album.forEach((album,index) => {
                        if (album.name !== '(null)'){    
                            let a = new Album();
                            a.albumName = album.name;
                            a.artist = album.artist.name;
                            a.imgUrl = album.image[3]['#text'];
                            if (a.imgUrl === '') {
                                a.imgUrl = process.env.PUBLIC_URL + '/assets/album.png';
                            }
                            a.id = index;
                            albums.push(a);
                        }
                        if (albums.length === 0) {
                            this.setState({searchStatus:'none'});
                        } else {
                            this.setState({searchAlbums:albums, searchStatus:'complete'});
                        }
                    });
                }).catch(()=>{
                    this.setState({searchStatus:'none'});
                })
            } else if (this.state.searchType === 'album') {
                let url = `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${this.state.searchField}&api_key=${this.state.key}&format=json`;
                axios.get(url)
                .then(data => {
                    return JSON.parse(data.request.response);
                }).then((data)=>{
                    console.log(data)
                    data.results.albummatches.album.forEach((album,index) => {
                        if (album.name !== '(null)'){    
                            let a = new Album();
                            a.albumName = album.name;
                            a.artist = album.artist.name;
                            a.imgUrl = album.image[3]['#text'];
                            if (a.imgUrl === '') {
                                a.imgUrl = process.env.PUBLIC_URL + '/assets/album.png';
                            }
                            a.id = index;
                            albums.push(a);
                        }
                    });
                }).catch(()=>{
                    this.setState({searchStatus:'none'});
                }).finally(() => {
                    if (albums.length === 0) {
                        this.setState({searchStatus:'none'});
                    } else {
                        this.setState({searchAlbums:albums, searchStatus:'complete'});
                    }
                })
            }
        }
        
    }

    updateSearchField = (e) => {
        if (this.state.searchStatus !== 'complete') {
            this.setState({searchStatus:'hold'});
        }
        this.setState({searchField:e.target.value});
    }

    submitSearch = (e) => {
        if (e.key === 'Enter') {
            this.search();
        }
    }

    getTracks = (album) => {
        let url = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${this.state.key}&artist=${album.artist}&album=${album.albumName}&format=json`;
        let tracks = [];
        this.setState({album:album, trackView:{on:true,status:'loading'}}, () => {
            axios.get(url).then(data => {
                return JSON.parse(data.request.response);
            }).then((album)=>{
                album.album.tracks.track.forEach(track => {
                    tracks.push(track.name);
                })
            }).catch(()=>{
                this.setState({trackView:{on:true,status:'none'}})
            }).finally(()=>{
                this.setState({trackList:tracks},()=>{
                    this.setState({trackView:{on:true,status:'complete'}})
                })
            })
        })
        
    }

    closeTracks = () => {
        this.setState({trackView:{on:false,status:'hold'}})
    }

    render(){
        const { searchStatus, searchAlbums, searchField, searchType, trackView, trackList } = this.state;
        const { recommendations, recommend, unrecommend, isLoggedIn } = this.props;
        return (
            <div className="search-page">
                <div className="form-container">
                    <div className='search-form' autoComplete="off">
                        <TextField 
                            autoComplete = 'false'
                            onChange={this.updateSearchField} 
                            className='search-input' 
                            label={`Search by ${searchType}`} 
                            onKeyUp={this.submitSearch}
                            type="search"
                        />
                    </div>
                    <Button 
                        onClick={this.search} 
                        variant="contained" 
                        className='search-btn' 
                        color="secondary"
                    >Search</Button>
                    
                </div>
                <div className='toggle-type'>
                    <ToggleButtonGroup size='small' value={this.state.searchType} onChange={this.changeType} exclusive>
                        <ToggleButton value="artist">Search by artist</ToggleButton>
                        <ToggleButton value="album">Search by album</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                { !trackView.on ? (
                    <div className="results">
                        { searchStatus === 'loading' && <h5>Searching for albums...</h5> }
                        { searchStatus === 'none' && <h5>No albums found for '{searchField}'</h5> }
                        { searchStatus === 'complete' && <h5>Click on album to view tracks</h5> }
                        { searchStatus === 'complete' && 
                            <AlbumList 
                                isLoggedIn={isLoggedIn} 
                                albums={searchAlbums} 
                                getTracks={this.getTracks} 
                                recs={recommendations} 
                                recommend={recommend}
                                unrecommend={unrecommend}
                                recView={false}
                            />
                        }
                    </div>
                ) : (
                    <div className="track">
                        <TrackList 
                            isLoggedIn={isLoggedIn} 
                            album={this.state.album} 
                            status={trackView.status} 
                            trackList={trackList} 
                            closeTracks={this.closeTracks}
                            recommend={recommend}
                            unrecommend={unrecommend}
                            recs={recommendations}
                        />
                    </div>
                ) }
                
                
            </div>
        )
    }
}

export default Search;