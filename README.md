# Amazon Photos Clone

## API Request Types

### 1. Create
Endpoint: `/photos/create/`<br/>
Request Type: `POST`<br/>
Required Body:
```
{
  photoUrl1: STRING, (REQUIRED)
  photoUrl2: STRING,
  photoUrl3: STRING,
  photoUrl4: STRING,
  photoUrl5: STRING,
  photoUrl6: STRING,
  photoUrl7: STRING,
}
```
### 2. Read
Endpoint: `/photos/id/:productId`<br/>
Request Type: `GET`<br/>
### 3. Update
Endpoint: `/photos/update/:productId`<br/>
Request Type: `PUT`<br/>
Required Body: (only include headers for desired updates)
```
{
  photoUrl1: STRING,
  photoUrl2: STRING,
  photoUrl3: STRING,
  photoUrl4: STRING,
  photoUrl5: STRING,
  photoUrl6: STRING,
  photoUrl7: STRING,
}
```
### 4. Delete
Endpoint: `/photos/delete/:productId`<br/>
Request Type: `DELETE`<br/>