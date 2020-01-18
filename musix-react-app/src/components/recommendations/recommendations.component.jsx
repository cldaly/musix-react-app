import React from 'react';
import AlbumList from '../album-list/album-list.component';
import TrackList from '../track-list/track-list.component';
import axios from 'axios';

import './recommendations.styles.css';

class Recommendations extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            trackView:{
                on:false,
                status: 'hold'
            },
            key: 'd02851a81c8e025c628c78519b0e0bd5',
            album: {
                id: null,
                albumName: undefined,
                artist: undefined,
                imgUrl: undefined
            },
            trackList: []
        }
    }

    componentDidMount = () => {
        this.props.getRecommendations();
    }

    getTracks = (album) => {
        let url = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${this.state.key}&artist=${album.artist}&album=${album.albumName}&format=json`;
        let tracks = [];
        this.setState({trackView:{on:true,status:'loading'},album:album}, () => {
            axios.get(url).then(data => {
                return JSON.parse(data.request.response);
            }).then((album)=>{
                album.album.tracks.track.forEach(track => {
                    tracks.push(track.name);
                })
                this.setState({trackList:tracks,trackView:{on:true,status:'complete'}})
            }).catch(()=>{
                this.setState({trackView:{on:true,status:'none'}})
            })
        })
    }

    closeTracks = () => {
        this.setState({trackView:{on:false,status:'hold'}, albumId:0})
    }

    render(){

        const {trackView,trackList } = this.state;
        const {searchStatus, recommendations, recommend, unrecommend} = this.props;
        
        return (
            <div className="recommendations">
                { !trackView.on ? (
                    <div className="results">
                        { searchStatus === 'loading' && <h5>Loading your recommendations...</h5> }
                        { searchStatus === 'none' && <h4>You do not have any recommendations...</h4> }
                        { searchStatus === 'complete' && <h5>Click on album to view tracks</h5> }
                        { searchStatus === 'complete' && 
                            <AlbumList 
                                isLoggedIn={this.props.isLoggedIn} 
                                getTracks={this.getTracks} 
                                recs={recommendations} 
                                recommend={recommend}
                                unrecommend={unrecommend}
                                recView={true}
                            />
                        }
                    </div>
                ) : (
                    <div className="track">
                        <TrackList 
                            isLoggedIn={this.props.isLoggedIn} 
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

export default Recommendations;