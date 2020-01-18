import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import './track-list.styles.css';

const TrackList = ({isLoggedIn, album, status, trackList, closeTracks, recommend, unrecommend, recs}) => {

    let albumId = 0;

    if (recs) {
        for (let rec of recs) {
            if (rec.albumName === album.albumName && rec.artist === album.artist && rec.imgUrl === album.imgUrl) {
                albumId = rec.id;
            }
        }
    }

    const recButton = isLoggedIn ? (
        <CardActions>
            {albumId === 0 && <Button onClick={recommend.bind(this,album)}>Recommend</Button>}
            {albumId !== 0 && <Button onClick={unrecommend.bind(this,albumId)}>Unrecommend</Button>}
        </CardActions>
    ) : (
        <Tooltip enterDelay={100} title='Login to recommend this album' arrow>
            <CardActions>
                <Button disabled={true}>Recommend</Button>
            </CardActions>
        </Tooltip>
    )

    return (
        <Card className='tracklist-card' >
            
            <CardHeader 
                title={album.albumName} 
                subheader={`by ${album.artist}`} 
                avatar={
                    <Avatar 
                        alt={`${album.albumName}, by ${album.artist}`}
                        src={album.imgUrl}
                        className='tracklist-image'
                    />
                }
                action={ <span onClick={closeTracks} className="close">Close</span> }
            />
            <CardContent>
                { recButton }
                { status === 'loading' && <h4>Loading tracks...</h4> }
                { status === 'none' && <h4>Sorry, no tracks...</h4> }
                { status === 'complete' && (
                    <ol>
                        {trackList.map((track, index)=>(<li key={index}>{track}</li>))}
                    </ol>
                ) }
            </CardContent>
        </Card>
    )
}

export default TrackList;