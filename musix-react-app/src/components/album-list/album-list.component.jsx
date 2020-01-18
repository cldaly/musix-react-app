import React from 'react';
import AlbumCard from '../album-card/album-card.component';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import './album-list.styles.css';

const AlbumList = ({albums, isLoggedIn, getTracks, recs, recommend, unrecommend, recView}) => {
    if (recView) { albums = recs; }
    let columns = (albums.length > 3) ? 3 : albums.length % 3;

    const getAlbumId = (a) => {
        if (recs){
            for (let rec of recs) {
                if (rec.albumName === a.albumName && rec.artist === a.artist && rec.imgUrl === a.imgUrl) {
                    return rec.id;
                }
            }
        }    
        return 0;
    }

    return (
        <div className='results'>
            <GridList cols={columns} spacing={20} cellHeight={'auto'}>
                {albums.map(album => (
                    <GridListTile key={album.id} style={{overflow: 'visible'}}> 
                        <AlbumCard 
                            isLoggedIn={isLoggedIn}
                            album={album}
                            getTracks={getTracks}
                            albumId={recs ? getAlbumId(album) : 0}
                            recommend={recommend}
                            unrecommend={unrecommend}
                        />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    )
}

export default AlbumList;