import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import './album-card.styles.css';

const AlbumCard = ({album, isLoggedIn, getTracks, albumId, recommend, unrecommend}) => {
    return(
        <Card className='album-card' >
            <CardHeader title={album.albumName} subheader={album.artist} onClick={getTracks.bind(this,album)} />
            <CardContent>
                <CardMedia
                    className='album-image'
                    image={album.imgUrl}
                    title={`${album.albumName}, by ${album.artist}`}
                    onClick={getTracks.bind(this,album)}
                />
                {isLoggedIn ? (
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
                )}
            </CardContent>
        </Card>
    )
}

export default AlbumCard;